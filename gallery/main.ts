/**
 * Gallery entry — imports each component from src/ and renders demo
 * variants. Bundled by gallery/serve.ts on startup.
 */
import { TOKEN_NAMES } from "../src/tokens/mod.ts";
import { pageLayout } from "../src/layout/mod.ts";
import { renderNav } from "../src/nav/mod.ts";
import { renderStepper } from "../src/stepper/mod.ts";
import { renderInviteWaitlist } from "../src/invite-waitlist/mod.ts";
import { getCountryName, renderWorldMap } from "../src/world-map/mod.ts";

// tokens — render a swatch per color token.
const swatchRow = document.getElementById("token-swatches")!;
for (const name of TOKEN_NAMES) {
  if (name.startsWith("--font")) continue;
  const swatch = document.createElement("div");
  swatch.className = "gallery-swatch";
  const color = document.createElement("div");
  color.className = "swatch-color";
  color.setAttribute("style", `background: var(${name})`);
  const label = document.createElement("div");
  label.className = "swatch-label";
  label.textContent = name;
  swatch.appendChild(color);
  swatch.appendChild(label);
  swatchRow.appendChild(swatch);
}

// layout — pageLayout demo
const demoNav = renderNav({ brand: "Demo App", version: "0.0.0" });
const demoContent = document.createElement("div");
demoContent.textContent =
  "main.container content goes here — auth/routing is consumer-owned";
const layoutWrapper = pageLayout(demoNav, demoContent);
document.getElementById("layout-demo")!.appendChild(layoutWrapper);

// nav — four variants
document.getElementById("nav-brand-only")!.appendChild(
  renderNav({ brand: "Council Console" }),
);
document.getElementById("nav-brand-version")!.appendChild(
  renderNav({ brand: "Provider Console", version: "0.2.18" }),
);
document.getElementById("nav-full")!.appendChild(
  renderNav({
    brand: "Moonlight Pay",
    version: "0.5.15",
    address: "GABCDEFGHIJKLMNOPQRSTUV",
    onLogout: () => alert("logout fired (gallery demo)"),
  }),
);
document.getElementById("nav-links")!.appendChild(
  renderNav({
    brand: "Moonlight Network",
    version: "0.2.8",
    links: [
      { href: "#/map", label: "Map" },
      { href: "#/councils", label: "Councils" },
      { href: "#/transactions", label: "Transactions" },
    ],
  }),
);

// stepper — three variants (mutable array)
const STEPS = [
  { id: "metadata", label: "Metadata" },
  { id: "fund", label: "Fund" },
  { id: "create", label: "Create" },
  { id: "invite", label: "Invite" },
];
document.getElementById("stepper-1")!.appendChild(
  renderStepper({ steps: STEPS, currentStepId: "metadata" }),
);
document.getElementById("stepper-2")!.appendChild(
  renderStepper({ steps: STEPS, currentStepId: "fund" }),
);
document.getElementById("stepper-4")!.appendChild(
  renderStepper({ steps: STEPS, currentStepId: "invite" }),
);

// stepper — readonly `as const` variant; currentStepId is narrowed
// to "account" | "treasury" automatically (try changing to "unknown" and
// the build will fail type-checking).
const READONLY_STEPS = [
  { id: "account", label: "Account" },
  { id: "treasury", label: "Treasury" },
] as const;
document.getElementById("stepper-readonly")!.appendChild(
  renderStepper({ steps: READONLY_STEPS, currentStepId: "treasury" }),
);

// invite-waitlist — three variants
document.getElementById("invite-with-disconnect")!.appendChild(
  renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOPQRSTUV",
    platformUrl: "https://example.test",
    onDisconnect: () => alert("disconnect fired (gallery demo)"),
  }),
);
document.getElementById("invite-without-disconnect")!.appendChild(
  renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOPQRSTUV",
    platformUrl: "https://example.test",
  }),
);
document.getElementById("invite-with-ids")!.appendChild(
  renderInviteWaitlist({
    address: "GABCDEFGHIJKLMNOPQRSTUV",
    platformUrl: "https://example.test",
    ids: { emailInput: "demo-email" },
  }),
);

// world-map — three variants. The SVG asset lives at gallery/world-map.svg
// for the demo; consumers ship their own copy in their public/ directory.
const WORLD_MAP_SVG = "/gallery/world-map.svg";

renderWorldMap({ svgUrl: WORLD_MAP_SVG })
  .then((handle) => {
    document.getElementById("world-map-empty")!.appendChild(handle.element);
  })
  .catch((err) => console.warn("world-map empty demo failed:", err));

renderWorldMap({
  svgUrl: WORLD_MAP_SVG,
  selected: ["US", "UY", "DE", "JP", "SG"],
})
  .then((handle) => {
    document.getElementById("world-map-selected")!.appendChild(handle.element);
  })
  .catch((err) => console.warn("world-map selected demo failed:", err));

renderWorldMap({
  svgUrl: WORLD_MAP_SVG,
  onSelect: (code) => {
    const status = document.getElementById("world-map-interactive-status")!;
    const interactiveHandle = interactiveRef;
    if (!interactiveHandle) return;
    const current = new Set(interactiveHandle.getSelected());
    if (current.has(code)) current.delete(code);
    else current.add(code);
    interactiveHandle.setSelected(Array.from(current));
    status.textContent = current.size === 0
      ? "no countries selected"
      : `selected: ${
        Array.from(current)
          .map((c) => `${c} (${getCountryName(c)})`)
          .join(", ")
      }`;
  },
})
  .then((handle) => {
    interactiveRef = handle;
    document.getElementById("world-map-interactive")!.appendChild(
      handle.element,
    );
  })
  .catch((err) => console.warn("world-map interactive demo failed:", err));

// Late-bound handle for the interactive demo — the onSelect callback above
// closes over this binding rather than the handle itself so the click
// handler is available before the SVG finishes loading.
let interactiveRef: Awaited<ReturnType<typeof renderWorldMap>> | null = null;
