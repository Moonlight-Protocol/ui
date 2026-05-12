import { assert, assertStringIncludes } from "@std/assert";
import { readTokensCss, TOKEN_NAMES, tokensCssPath } from "./mod.ts";

Deno.test("tokens.css file exists at expected path", async () => {
  const stat = await Deno.stat(tokensCssPath());
  assert(stat.isFile);
});

Deno.test("tokens.css defines every token in TOKEN_NAMES", async () => {
  const css = await readTokensCss();
  assertStringIncludes(css, ":root {");
  for (const name of TOKEN_NAMES) {
    assertStringIncludes(css, `${name}:`);
  }
});

Deno.test("tokens.css preserves verbatim values from source apps", async () => {
  const css = await readTokensCss();
  assertStringIncludes(css, "--bg: #0f1117");
  assertStringIncludes(css, "--primary: #6366f1");
  assertStringIncludes(css, "--active: #22c55e");
});
