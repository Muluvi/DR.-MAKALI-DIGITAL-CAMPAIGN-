// js-yaml ships no types and @types/js-yaml is not installed: the one function the content build
// uses, declared to the extent it is used.
declare module "js-yaml" {
  export function load(source: string, options?: { filename?: string }): unknown;
  const yaml: { load: typeof load };
  export default yaml;
}
