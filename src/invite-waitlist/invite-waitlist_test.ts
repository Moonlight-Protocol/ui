import { assert, assertEquals } from "@std/assert";
import { mountTestDom } from "../_test/dom.ts";
import { renderInviteWaitlist } from "./mod.ts";

Deno.test("renderInviteWaitlist returns the .login-container > .login-card shell", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
  });
  assertEquals(el.className, "login-container");
  const card = el.querySelector(".login-card");
  assert(card, "login-card should be present");
});

Deno.test("renderInviteWaitlist truncates the address for display", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
  });
  const addr = el.querySelector(".mono");
  assert(addr, "mono address element should be present");
  assertEquals(addr!.textContent, "GABCDE...MNOP");
});

Deno.test("renderInviteWaitlist renders an email input, a submit button, and hidden status/error slots", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
  });
  const input = el.querySelector("input[type='email']");
  assert(input, "email input should be present");
  const btn = el.querySelector(".btn-primary");
  assert(btn, "submit button should be present");
  const status = el.querySelector(".hint-text");
  const error = el.querySelector(".error-text");
  assert(
    status?.hasAttribute("hidden"),
    "status should be hidden initially",
  );
  assert(
    error?.hasAttribute("hidden"),
    "error should be hidden initially",
  );
});

Deno.test("renderInviteWaitlist renders the logo when logoSrc is provided", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
    logoSrc: "/logo.png",
  });
  const img = el.querySelector("img");
  assert(img, "logo img should be present");
  assertEquals(img!.getAttribute("src"), "/logo.png");
});

Deno.test("renderInviteWaitlist omits the logo when logoSrc is missing", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
  });
  assertEquals(el.querySelector("img"), null);
});

Deno.test("renderInviteWaitlist renders the disconnect link when onDisconnect is provided", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
    onDisconnect: () => {},
  });
  const link = el.querySelector(".btn-link");
  assert(link, "disconnect link should render when onDisconnect provided");
  assertEquals(link!.textContent, "Disconnect");
});

Deno.test("renderInviteWaitlist omits disconnect link when onDisconnect not provided", () => {
  mountTestDom();
  const el = renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOP",
    platformUrl: "https://example.test",
  });
  assertEquals(el.querySelector(".btn-link"), null);
});
