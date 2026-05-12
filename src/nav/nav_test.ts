import { assert, assertEquals } from "@std/assert";
import { mountTestDom } from "../_test/dom.ts";
import { renderNav } from "./mod.ts";

Deno.test("renderNav with only brand renders nav with brand and no extras", () => {
  mountTestDom();
  const nav = renderNav({ brand: "Test App" });
  assertEquals(nav.tagName, "NAV");
  const brand = nav.querySelector(".nav-brand");
  assert(brand, "brand link should exist");
  assertEquals(brand!.textContent, "Test App");
  assertEquals(nav.querySelector(".version-badge"), null);
  assertEquals(nav.querySelector(".nav-address"), null);
  assertEquals(nav.querySelector(".icon-btn"), null);
});

Deno.test("renderNav with version shows the version badge", () => {
  mountTestDom();
  const nav = renderNav({ brand: "Pay", version: "0.5.15" });
  const badge = nav.querySelector(".version-badge");
  assert(badge, "version badge should be rendered");
  assertEquals(badge!.textContent, "v0.5.15");
});

Deno.test("renderNav with address truncates to first6...last4", () => {
  mountTestDom();
  const nav = renderNav({
    brand: "Council",
    address: "GABCDEFGHIJKLMNOP",
  });
  const addr = nav.querySelector(".nav-address");
  assert(addr, "address element should render");
  assertEquals(addr!.textContent, "GABCDE...MNOP");
});

Deno.test("renderNav with onLogout renders a logout button", () => {
  mountTestDom();
  const nav = renderNav({ brand: "Provider", onLogout: () => {} });
  const btn = nav.querySelector(".icon-btn");
  assert(btn, "logout button should render");
  assertEquals(btn!.getAttribute("title"), "Logout");
});

Deno.test("renderNav without onLogout omits the logout button", () => {
  mountTestDom();
  const nav = renderNav({ brand: "Network" });
  assertEquals(nav.querySelector(".icon-btn"), null);
});

Deno.test("renderNav with links renders each link", () => {
  mountTestDom();
  const nav = renderNav({
    brand: "Network",
    links: [
      { href: "#/map", label: "Map" },
      { href: "#/councils", label: "Councils" },
    ],
  });
  const anchors = nav.querySelectorAll(".nav-links a");
  assertEquals(anchors.length, 2);
  assertEquals(anchors.item(0).textContent, "Map");
  assertEquals(anchors.item(1).textContent, "Councils");
});
