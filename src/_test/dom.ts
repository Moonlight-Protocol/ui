/**
 * Test-only helper to mount a deno_dom parsed document onto globalThis so
 * components that call `document.createElement(...)` work in `deno test`.
 *
 * Not part of the public API — only consumed by `*_test.ts` files in this repo.
 */
import { DOMParser } from "deno_dom";

export function mountTestDom(): Document {
  const dom = new DOMParser().parseFromString(
    "<!doctype html><html><body></body></html>",
    "text/html",
  );
  if (!dom) throw new Error("failed to parse test DOM");
  // deno_dom's Document is structurally close enough to lib.dom's Document
  // for our component code (createElement / querySelector / addEventListener).
  // deno-lint-ignore no-explicit-any
  (globalThis as any).document = dom;
  return dom as unknown as Document;
}
