/**
 * Gallery entry — imports each component from src/ and renders demo
 * variants. Bundled by gallery/serve.ts on startup.
 */
import { TOKEN_NAMES } from "../src/tokens/mod.ts";
import { pageLayout } from "../src/layout/mod.ts";
import { renderNav } from "../src/nav/mod.ts";
import { renderStepper } from "../src/stepper/mod.ts";
import { renderInviteWaitlist } from "../src/invite-waitlist/mod.ts";

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

// stepper — three variants
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
