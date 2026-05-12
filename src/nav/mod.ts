export interface NavLink {
  href: string;
  label: string;
}

export interface RenderNavOptions {
  /** Brand label rendered as the leftmost element. */
  brand: string;
  /** Optional `v{version}` badge shown next to the brand. */
  version?: string;
  /** Optional nav links rendered between the brand and the address/logout. */
  links?: NavLink[];
  /** Connected wallet address. Truncated to first6...last4 before display. */
  address?: string | null;
  /** If set, a logout button is rendered that fires this callback on click. */
  onLogout?: () => void;
}

const LOGOUT_ICON_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

function truncateAddress(address: string): string {
  return address.length > 12
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderNav(opts: RenderNavOptions): HTMLElement {
  const nav = document.createElement("nav");

  const inner = document.createElement("div");
  inner.className = "nav-inner";

  const brandLink = document.createElement("a");
  brandLink.setAttribute("href", "#/");
  brandLink.className = "nav-brand";
  brandLink.textContent = opts.brand;
  if (opts.version) {
    const badge = document.createElement("span");
    badge.className = "version-badge";
    badge.textContent = `v${opts.version}`;
    brandLink.appendChild(document.createTextNode(" "));
    brandLink.appendChild(badge);
  }
  inner.appendChild(brandLink);

  const right = document.createElement("div");
  right.className = "nav-links";

  for (const link of opts.links ?? []) {
    const a = document.createElement("a");
    a.setAttribute("href", link.href);
    a.textContent = link.label;
    right.appendChild(a);
  }

  if (opts.address) {
    const addr = document.createElement("span");
    addr.className = "nav-address";
    addr.textContent = truncateAddress(opts.address);
    right.appendChild(addr);
  }

  if (opts.onLogout) {
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.setAttribute("title", "Logout");
    btn.innerHTML = LOGOUT_ICON_SVG;
    btn.addEventListener("click", opts.onLogout);
    right.appendChild(btn);
  }

  inner.appendChild(right);
  nav.appendChild(inner);
  return nav;
}

// `escapeHtml` is re-exported so consumers that build attribute values
// from untrusted text (e.g. brand text from user-supplied config) can
// sanitize before passing to renderNav. The implementation here uses
// textContent for safe element insertion already; this export exists
// for consumer convenience.
export { escapeHtml };
