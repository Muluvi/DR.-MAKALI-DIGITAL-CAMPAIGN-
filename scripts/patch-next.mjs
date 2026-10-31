import fs from 'node:fs';
import path from 'node:path';

// Fixes an upstream bug in Next.js 15.5.x where validFileMatcher.isRootNotFound receives
// relative paths from recursiveReadDir but checks startsWith(appDirPath), causing root
// app/not-found.tsx to be excluded from mappedAppPages and throwing an invariant during build.
const file = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server', 'lib', 'find-page-file.js');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const targetPattern = /function isRootNotFound\(filePath\)[\s\S]*?return rootNotFoundFileRegex\.test\(rest\);[\s\S]*?\}/;
  const replacement = `function isRootNotFound(filePath) {
        if (!appDirPath) return false;
        const rest = filePath.startsWith(appDirPath + _path.sep) ? filePath.slice(appDirPath.length + 1) : filePath.startsWith(_path.sep) ? filePath.slice(1) : filePath;
        return rootNotFoundFileRegex.test(rest);
    }`;

  if (targetPattern.test(content)) {
    const updated = content.replace(targetPattern, replacement);
    fs.writeFileSync(file, updated, 'utf8');
    console.log('[patch-next] Applied isRootNotFound patch to Next.js');
  }
}
