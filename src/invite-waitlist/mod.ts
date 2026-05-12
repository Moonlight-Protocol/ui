/**
 * Optional consumer-passed DOM ids. Provide an id here if the consumer's
 * test contract (or external integration) needs a stable selector on a
 * rendered element. If a field is omitted, the element renders without
 * that id. The lib never defaults these values — the consumer owns the
 * id namespace.
 */
export interface InviteWaitlistIds {
  /** id applied to the email `<input>` element. */
  emailInput?: string;
}

export interface RenderInviteWaitlistOptions {
  /** Connected wallet address — shown truncated; included in the waitlist POST body. */
  address: string;
  /** Base URL of the platform API. Waitlist submission POSTs to `${platformUrl}/api/v1/waitlist`. */
  platformUrl: string;
  /** Logo image src. If omitted, no logo is rendered. */
  logoSrc?: string;
  /** Fired when the user clicks the "Disconnect" link. */
  onDisconnect?: () => void;
  /** Consumer-passed DOM ids on internal elements. See {@link InviteWaitlistIds}. */
  ids?: InviteWaitlistIds;
}

function truncateAddress(address: string): string {
  return address.length > 12
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

export function renderInviteWaitlist(
  opts: RenderInviteWaitlistOptions,
): HTMLElement {
  const container = document.createElement("div");
  container.className = "login-container";

  const card = document.createElement("div");
  card.className = "login-card";
  card.setAttribute("style", "text-align: center");

  if (opts.logoSrc) {
    const logo = document.createElement("img");
    logo.setAttribute("src", opts.logoSrc);
    logo.setAttribute("alt", "Logo");
    logo.setAttribute("style", "width: 80px; margin-bottom: 1rem");
    card.appendChild(logo);
  }

  const heading = document.createElement("h2");
  heading.textContent = "Invite Only";
  card.appendChild(heading);

  const subtitle = document.createElement("p");
  subtitle.textContent = "This app is currently invite-only.";
  card.appendChild(subtitle);

  const addrEl = document.createElement("p");
  addrEl.className = "mono";
  addrEl.setAttribute("style", "margin-bottom: 1.5rem");
  addrEl.textContent = truncateAddress(opts.address);
  card.appendChild(addrEl);

  const formGroup = document.createElement("div");
  formGroup.className = "form-group";
  const emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("placeholder", "your@email.com");
  emailInput.setAttribute("autocomplete", "email");
  if (opts.ids?.emailInput) {
    emailInput.setAttribute("id", opts.ids.emailInput);
  }
  formGroup.appendChild(emailInput);
  card.appendChild(formGroup);

  const submitBtn = document.createElement("button");
  submitBtn.className = "btn-primary btn-wide";
  submitBtn.textContent = "Join Waitlist";
  card.appendChild(submitBtn);

  const statusEl = document.createElement("p");
  statusEl.className = "hint-text";
  statusEl.setAttribute("hidden", "");
  card.appendChild(statusEl);

  const errorEl = document.createElement("p");
  errorEl.className = "error-text";
  errorEl.setAttribute("hidden", "");
  card.appendChild(errorEl);

  if (opts.onDisconnect) {
    const disconnect = document.createElement("a");
    disconnect.setAttribute("href", "#");
    disconnect.className = "btn-link";
    disconnect.setAttribute(
      "style",
      "margin-top: 1rem; display: inline-block",
    );
    disconnect.textContent = "Disconnect";
    disconnect.addEventListener("click", (e: Event) => {
      e.preventDefault();
      opts.onDisconnect!();
    });
    card.appendChild(disconnect);
  }

  submitBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) return;

    statusEl.setAttribute("hidden", "");
    errorEl.setAttribute("hidden", "");
    submitBtn.disabled = true;

    try {
      const res = await fetch(`${opts.platformUrl}/api/v1/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, walletPublicKey: opts.address }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `request failed (${res.status})`);
      }
      statusEl.textContent = "Thanks — we'll be in touch.";
      statusEl.removeAttribute("hidden");
      emailInput.value = "";
    } catch (err) {
      errorEl.textContent = err instanceof Error
        ? err.message
        : "Submission failed.";
      errorEl.removeAttribute("hidden");
      submitBtn.disabled = false;
    }
  });

  container.appendChild(card);
  return container;
}
