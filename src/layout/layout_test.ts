import { assert, assertEquals } from "@std/assert";
import { mountTestDom } from "../_test/dom.ts";
import { pageLayout } from "./mod.ts";

Deno.test("pageLayout wraps nav and content in <div><nav/><main class='container'>{content}</main></div>", () => {
  const doc = mountTestDom();
  const nav = doc.createElement("nav");
  nav.textContent = "test-nav";
  const content = doc.createElement("section");
  content.textContent = "test-content";

  const wrapper = pageLayout(nav, content);

  assertEquals(wrapper.tagName, "DIV");
  const main = wrapper.querySelector("main");
  assert(main, "main element should be present");
  assertEquals(main!.className, "container");
  assert(
    wrapper.firstChild === nav,
    "nav should be the first child of the wrapper",
  );
  assertEquals(
    main!.firstChild,
    content,
    "content should be appended inside main",
  );
});
