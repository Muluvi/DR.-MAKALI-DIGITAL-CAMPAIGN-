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
        /**
         * Accessibility, checked rather than reasoned about.
         *
         * `eslint-config-next` already registers eslint-plugin-jsx-a11y and turns on a handful of
         * its rules as warnings; no new dependency is needed, only a decision about which of them
         * are allowed to fail the build. These are errors because each corresponds to a defect
         * this document actually had: a figure labelled only by colour, an `aria-hidden` wrapper
         * around something focusable, a role without the props that make it mean anything.
         *
         * The rest of the accessibility work — scoped table headers, 44px targets, the reading
         * order of a disclosure — is not lintable and is checked by the axe sweep in CI instead.
         */
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/heading-has-content": "error",


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
