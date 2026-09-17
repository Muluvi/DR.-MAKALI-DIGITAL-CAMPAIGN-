import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    // The analysis pipeline is Python, and its virtualenv contains vendored JavaScript
    // (matplotlib ships a web backend). Linting that is noise about third-party code nobody
    // here wrote or can fix, so the whole directory is out of scope for eslint. Its own
    // quality gate is pytest, run from /analysis.
    ignores: ["analysis/**"],
}, {
    extends: [...next],
    rules: {
        // One animation import path.
        //
        // `motion` and `framer-motion` are the same library under its new and old names, and
        // `motion` depends on `framer-motion` internally — so it cannot be uninstalled, only
        // left unimported. Importing it directly would pull a second copy past
        // `transpilePackages: ['motion']` in next.config.ts and bundle the runtime twice.
        //
        // Everything animating in this repo imports from "motion/react", and the shared tokens
        // live in lib/motion.ts.
        "no-restricted-imports": ["error", {
            paths: [{
                name: "framer-motion",
                message: "Import from \"motion/react\" instead — framer-motion is the same library under its old name, and importing both bundles the runtime twice.",
            }],
        }],
    },
}]);
