// No official types package exists, and the real constructor isn't even reachable from this module's
// own exports in this bundling setup anyway (see WowInit.tsx's header comment) — this file only
// exists to satisfy TS7016 for the bare `import("wowjs")` call.
declare module "wowjs";
