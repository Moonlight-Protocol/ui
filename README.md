# @moonlight/ui

Shared vanilla-DOM UI components for Moonlight apps.

Targets: `council-console`, `provider-console`, `network-dashboard`,
`moonlight-pay` (the four Deno + TypeScript + DOM apps). No React, Tailwind,
Radix, or shadcn.

## Distribution

Direct from git. Consumers pin to a tag.

In a consumer's `deno.json`:

```json
{
  "imports": {
    "@moonlight/ui/tokens": "https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/tokens/mod.ts",
    "@moonlight/ui/nav": "https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/nav/mod.ts",
    "@moonlight/ui/layout": "https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/layout/mod.ts",
    "@moonlight/ui/stepper": "https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/stepper/mod.ts",
    "@moonlight/ui/invite-waitlist": "https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/invite-waitlist/mod.ts"
  }
}
```

Stylesheets are referenced via `<link rel="stylesheet">` in the consumer's
`index.html` (one tag per stylesheet, pinned to the same tag):

```html
<link
  rel="stylesheet"
  href="https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/tokens/tokens.css"
>
<link
  rel="stylesheet"
  href="https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/base-styles/base-styles.css"
>
<link
  rel="stylesheet"
  href="https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/nav/nav.css"
>
<link
  rel="stylesheet"
  href="https://raw.githubusercontent.com/Moonlight-Protocol/ui/v0.3.1/src/stepper/stepper.css"
>
```

`raw.githubusercontent.com` serves `text/plain`. If the consumer's app bundles
CSS at build time, the build script should fetch and concatenate, not rely on
browser-side `<link>` of raw URLs.

## Consumer-passed ids

Components in this lib do not hardcode DOM `id` attributes. When a consumer's
test contract (or external integration) needs a stable selector on a specific
rendered element, the component exposes an optional `ids?:` option that the
consumer fills in. Lib defaults are never set — if `ids.someElement` is omitted,
the element renders without that id.

Today `renderInviteWaitlist` is the only component with an `ids` option, because
the local-dev playwright `invite-gate.spec.ts` test asserts on
`#waitlist-email`. **New components should not preemptively add `ids?:`** — add
it only when a real consumer contract surfaces the need, so the lib surface
stays minimal.

## Components

### `tokens`

CSS custom properties. Defines `--bg`, `--surface`, `--border`, `--text`,
`--text-muted`, `--primary`, `--primary-hover`, `--active`, `--pending`,
`--inactive`, `--font-mono`, `--font-sans` on `:root`.

```ts
// No JS API — just the stylesheet.
// <link rel="stylesheet" href=".../tokens.css">
```

### `base-styles`

Shared class definitions used across components and consumer-app views. Includes
layout (`.container`), buttons (`.btn-primary`, `.btn-link`, `.btn-wide`,
`.icon-btn`), badges (`.badge`, `.badge-active`, `.badge-pending`,
`.badge-inactive`), forms (`.form-group`), cards (`.login-container`,
`.login-card`, `.stat-card`, etc.), and utilities (`.mono`, `.error-text`,
`.empty-state`, `.version-mismatch-banner`).

```ts
// No JS API — just the stylesheet.
// <link rel="stylesheet" href=".../base-styles.css">
```

### `layout`

```ts
import { pageLayout } from "@moonlight/ui/layout";

const wrapper = pageLayout(navElement, contentElement);
```

Returns a `<div>` with `nav` prepended and
`<main class="container">{content}</main>` appended. Pure layout primitive —
auth and routing live in the consumer.

### `nav`

```ts
import { renderNav } from "@moonlight/ui/nav";

const nav = renderNav({
  brand: "Council Console",
  version: "0.5.20",
  links: [{ href: "#/", label: "Home" }],
  address: "GABCD...XYZW",
  onLogout: () => {/* consumer's logout */},
});
```

| Option     | Type                          | Behavior                                                   |
| ---------- | ----------------------------- | ---------------------------------------------------------- |
| `brand`    | `string`                      | Brand label rendered in the nav.                           |
| `version`  | `string \| undefined`         | Renders a `v{version}` badge next to the brand if present. |
| `links`    | `NavLink[] \| undefined`      | Optional nav links rendered after the brand.               |
| `address`  | `string \| null \| undefined` | Connected address — truncated and displayed if present.    |
| `onLogout` | `() => void \| undefined`     | If present, renders a logout button that fires this.       |

Stylesheet: `nav.css` (renders `.nav-inner`, `.nav-brand`, `.nav-links`,
`.version-badge`, `.nav-address`, `.icon-btn`).

### `stepper`

```ts
import { renderStepper } from "@moonlight/ui/stepper";

// Mutable array — currentStepId is any string.
const stepper1 = renderStepper({
  steps: [
    { id: "metadata", label: "Metadata" },
    { id: "fund", label: "Fund" },
    { id: "create", label: "Create" },
  ],
  currentStepId: "fund",
});

// `as const` tuple — currentStepId is narrowed to "account" | "treasury".
// Passing an unknown id is a compile-time error.
const STEPS = [
  { id: "account", label: "Account" },
  { id: "treasury", label: "Treasury" },
] as const;
const stepper2 = renderStepper({ steps: STEPS, currentStepId: "treasury" });
```

Renders the progress stepper used by onboarding/setup flows. Done steps get a
`done` modifier and a check glyph; the current step gets `active`. Step list is
consumer-supplied — no hard-coded step vocabulary.

Signature is generic:
`renderStepper<T extends ReadonlyArray<StepperStep>>({ steps: T, currentStepId: T[number]["id"] })`.
This accepts both mutable `StepperStep[]` and readonly `as const` tuples; when
the consumer uses `as const`, `currentStepId` is constrained to the literal `id`
values of that tuple at the type level.

Stylesheet: `stepper.css`.

### `invite-waitlist`

```ts
import { renderInviteWaitlist } from "@moonlight/ui/invite-waitlist";

const view = renderInviteWaitlist({
  address: "GABCD...XYZW",
  platformUrl: "https://api.example.com",
  logoSrc: "/moonlight.png",
  onDisconnect: () => {/* consumer's disconnect logic */},
  ids: { emailInput: "waitlist-email" },
});
```

Renders the invite-only/waitlist screen used by the 3 console apps' login flows.
Submits `POST {platformUrl}/api/v1/waitlist` with `{ email, walletPublicKey }`
(the `walletPublicKey` field carries the value passed in `opts.address`). Calls
`onDisconnect` when the "Disconnect" link is clicked.

| Option           | Type                  | Behavior                                                                                                                                 |
| ---------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ids.emailInput` | `string \| undefined` | If set, applied as the `id` attribute on the email `<input>`. Omitted by default — no id is set. Use this to wire up E2E test selectors. |

Depends on `base-styles.css` for `.login-container`, `.login-card`,
`.btn-primary`, `.btn-wide`, `.btn-link`, `.error-text`, `.form-group`, `.mono`,
`.hint-text`.

## Gallery

```bash
deno task gallery
```

Serves a static gallery at `http://localhost:8000` showing every component with
meaningful variants. No framework — plain Deno HTTP server.

## Development

```bash
deno task fmt:check
deno task lint
deno task test
```

CI runs the same three on every PR (`.github/workflows/pr.yml`).

## License

MIT.
