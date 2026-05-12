import { assert, assertStringIncludes } from "@std/assert";
import { baseStylesCssPath, readBaseStylesCss } from "./mod.ts";

Deno.test("base-styles.css file exists", async () => {
  const stat = await Deno.stat(baseStylesCssPath());
  assert(stat.isFile);
});

Deno.test("base-styles.css defines the shared class vocabulary", async () => {
  const css = await readBaseStylesCss();
  const required = [
    ".container",
    ".btn-primary",
    ".btn-link",
    ".btn-wide",
    ".badge",
    ".badge-active",
    ".badge-pending",
    ".badge-inactive",
    ".form-group",
    ".form-row",
    ".login-container",
    ".login-card",
    ".mono",
    ".error-text",
    ".hint-text",
    ".empty-state",
    ".stat-card",
    ".stat-value",
    ".stat-label",
    ".stats-row",
    ".version-mismatch-banner",
  ];
  for (const sel of required) {
    assertStringIncludes(css, sel);
  }
});
