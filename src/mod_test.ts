import { assertEquals } from "@std/assert";

Deno.test("bootstrap smoke — deno test runs", () => {
  assertEquals(1 + 1, 2);
});
