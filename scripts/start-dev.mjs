#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import { spawn, execSync } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';

const APP_DIR = process.cwd();
const NEXT_BIN = path.join(APP_DIR, 'node_modules', 'next', 'dist', 'bin', 'next');
const PORT = 3000;
const HOST = '0.0.0.0';

/**
 * Check if a TCP port is in use
 */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port, HOST);
  });
}

/**
 * Free port 3000 if occupied by a stale/orphan process
 */
async function ensurePortAvailable(port) {
  const inUse = await isPortInUse(port);
  if (!inUse) return;

  console.log(`[start-dev] Port ${port} is in use, terminating stale process...`);
  try {
    const ssOut = execSync(`ss -tlpn "sport = :${port}" 2>/dev/null`, { encoding: 'utf8' });
    const match = ssOut.match(/pid=(\d+)/);
    if (match && match[1]) {
      const pid = parseInt(match[1], 10);
      if (pid !== process.pid) {
        console.log(`[start-dev] Killing stale process ${pid} on port ${port}...`);
        try {
          process.kill(pid, 'SIGTERM');
          await new Promise((r) => setTimeout(r, 500));
          // If still alive, force kill
          process.kill(pid, 'SIGKILL');
        } catch {
          // Process already terminated
        }
      }
    }
  } catch {
    // ss command fallback
  }

  // Wait briefly for socket release
  for (let i = 0; i < 10; i++) {
    if (!(await isPortInUse(port))) break;
    await new Promise((r) => setTimeout(r, 200));
  }
}

/**
 * Ensure node_modules and next binary exist
 */
async function ensureDependencies() {
  if (existsSync(NEXT_BIN)) {
    return;
  }

  console.log('[start-dev] Next.js binary not found. Waiting for background installation...');
  const maxWaitMs = 15000;
  const pollInterval = 500;
  let elapsed = 0;

  while (elapsed < maxWaitMs) {
    await new Promise((r) => setTimeout(r, pollInterval));
    elapsed += pollInterval;
    if (existsSync(NEXT_BIN)) {
      console.log(`[start-dev] Next.js binary found after ${elapsed}ms.`);
      return;
    }
  }

  console.log('[start-dev] Dependencies not ready after wait. Running npm install...');
  try {
    execSync('npm install --no-audit --no-fund', {
      cwd: APP_DIR,
      stdio: 'inherit',
      env: process.env,
    });
    console.log('[start-dev] npm install completed successfully.');
  } catch (err) {
    console.error('[start-dev] npm install failed:', err);
  }
}

/**
 * Clean up stale build locks if any
 */
function cleanStaleLocks() {
  const lockFiles = [
    path.join(APP_DIR, '.next', 'trace'),
    path.join(APP_DIR, '.next', 'lock'),
  ];
  for (const lockFile of lockFiles) {
    if (existsSync(lockFile)) {
      try {
        rmSync(lockFile, { force: true });
      } catch {
        // Ignore if unable to remove
      }
    }
  }
}

async function main() {
  // 1. Ensure dependencies are present
  await ensureDependencies();

  if (!existsSync(NEXT_BIN)) {
    console.error(`[start-dev] Fatal error: Could not find ${NEXT_BIN}`);
    process.exit(1);
  }

  // 2. Clean stale locks
  cleanStaleLocks();

  // 3. Ensure port 3000 is clean and not occupied by an orphan process
  await ensurePortAvailable(PORT);

  // 4. Set appropriate memory options if not defined
  const env = { ...process.env };
  if (!env.NODE_OPTIONS || !env.NODE_OPTIONS.includes('--max-old-space-size')) {
    env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --max-old-space-size=3072`.trim();
  }

  // 5. Spawn Next dev server
  console.log(`[start-dev] Launching Next.js dev server on ${HOST}:${PORT}...`);
  const child = spawn(process.execPath, [NEXT_BIN, 'dev', '-H', HOST, '-p', String(PORT)], {
    cwd: APP_DIR,
    stdio: 'inherit',
    env,
  });

  // 6. Forward termination signals cleanly to child process
  const forwardSignal = (sig) => {
    if (!child.killed) {
      child.kill(sig);
    }
  };

  process.on('SIGTERM', () => forwardSignal('SIGTERM'));
  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGHUP', () => forwardSignal('SIGHUP'));

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });
}

main().catch((err) => {
  console.error('[start-dev] Unhandled error in dev server startup:', err);
  process.exit(1);
});
