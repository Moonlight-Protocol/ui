/**
 * Shared world-map component.
 *
 * Renders the simple-world-map SVG (CC BY-SA 3.0, Al MacDonald / Fritz
 * Lekschas) with selected ISO 3166-1 alpha-2 jurisdictions highlighted.
 * Consumers ship the `world-map.svg` asset in their public/ directory
 * (the same file network-dashboard / council-console already serve), and
 * point this component at it via the `svgUrl` option.
 *
 * The component:
 *   - Fetches the SVG, parses it once, and applies fills based on each
 *     `<g id="…">` / `<path id="…">` country code.
 *   - Tags every country with `data-country="<ISO code>"` and intercepts
 *     clicks on the host element via event delegation. Consumers wire
 *     filter behaviour via `onSelect`.
 *   - Tracks the selected set and re-applies fills cheaply on each
 *     `setSelected(...)` call (no SVG re-fetch).
 *
 * Companion CSS: consumers should fetch `src/world-map/world-map.css`
 * alongside `tokens.css` + `base-styles.css` at build time.
 */

import { COUNTRIES, type CountryInfo, getCountryName } from "./countries.ts";

export { COUNTRIES, type CountryInfo, getCountryName };

export interface RenderWorldMapOptions {
  /** ISO 3166-1 alpha-2 codes to render as selected on first paint. */
  selected?: string[];
  /** Fires on any country click — receives the upper-case ISO code. */
  onSelect?: (countryCode: string) => void;
  /** Fires when an already-selected country is clicked. Optional convenience. */
  onDeselect?: (countryCode: string) => void;
  /**
   * Fires when the pointer enters / leaves a country. The callback receives
   * the upper-case ISO code on enter, and `null` on leave. The component
   * itself does not toggle any hover state — apply visuals reactively via
   * `setSlot` from the handler if you want hover-driven highlighting.
   */
  onHover?: (countryCode: string | null) => void;
  /** Path to the simple-world-map SVG. Default `/world-map.svg`. */
  svgUrl?: string;
  /** Optional aria-label override. */
  ariaLabel?: string;
}

export interface WorldMapHandle {
  /** Top-level host element to attach into the page. */
  element: HTMLElement;
  /** Replace the selected set; only differing countries get re-styled. */
  setSelected(codes: string[]): void;
  /**
   * Apply a CSS class slot to a set of country codes (or replace the prior
   * set for that slot). Slot is an arbitrary CSS class name — the component
   * has no opinion about what each slot *means*, only that calling
   * `setSlot("foo", ["US"])` will add `.foo` to the US country group and
   * remove `.foo` from every other country. Pass `[]` to clear a slot.
   *
   * Consumers ship CSS rules like `.world-map-country.<slot> { fill: … }`
   * to colour the slot. Slot names are sanitized to a CSS-class-safe form;
   * empty / invalid slot strings are dropped.
   */
  setSlot(slot: string, codes: string[]): void;
  /** Currently-selected codes in the order they were last set. */
  getSelected(): string[];
}

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX = "30.767 241.591 784.077 458.627";

/**
 * Build a world-map component bound to the supplied options. The returned
 * promise resolves once the SVG has loaded and been styled; callers can
 * attach `handle.element` before it resolves and the SVG will appear
 * inside it asynchronously.
 */
export async function renderWorldMap(
  options: RenderWorldMapOptions = {},
): Promise<WorldMapHandle> {
  const svgUrl = options.svgUrl ?? "/world-map.svg";

  const host = document.createElement("div");
  host.className = "world-map-host";
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", options.ariaLabel ?? "World map");

  // Selected set is mutable; keep insertion order for getSelected().
  let selected = new Set<string>((options.selected ?? []).map(normalize));
  // Arbitrary CSS-class slots applied via setSlot. Storing them in a map
  // lets a fresh setSlot("foo", [...]) cheaply diff against the prior set
  // and add/remove the class only on the differing country elements.
  const slots: Map<string, Set<string>> = new Map();
  // Currently-hovered country, or null when the pointer is outside any
  // country. Used to debounce onHover so it only fires on actual changes.
  let hovered: string | null = null;

  let svgRoot: SVGSVGElement | null = null;

  function normalize(code: string): string {
    return code.trim().toUpperCase();
  }

  /**
   * CSS class names must start with `[A-Za-z_]` and contain only
   * `[A-Za-z0-9_-]`. Anything else is dropped to keep selectors valid
   * and untrusted slot inputs harmless.
   */
  function sanitizeSlot(slot: string): string | null {
    const trimmed = slot.trim();
    if (!trimmed) return null;
    if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(trimmed)) return null;
    return trimmed;
  }

  function applyFills(): void {
    if (!svgRoot) return;
    const countries = svgRoot.querySelectorAll<SVGElement>("[data-country]");
    for (const el of countries) {
      const code = el.dataset.country ?? "";
      el.classList.toggle("selected", selected.has(code));
    }
  }

  function onHostClick(ev: MouseEvent): void {
    const target = ev.target as Element | null;
    if (!target) return;
    const owner = target.closest("[data-country]") as HTMLElement | null;
    if (!owner) return;
    const code = owner.dataset.country ?? "";
    if (!code) return;
    const wasSelected = selected.has(code);
    options.onSelect?.(code);
    if (wasSelected) options.onDeselect?.(code);
  }

  function onHostMouseOver(ev: MouseEvent): void {
    if (!options.onHover) return;
    const target = ev.target as Element | null;
    const owner = target?.closest("[data-country]") as HTMLElement | null;
    const code = owner?.dataset.country ?? null;
    if (code !== hovered) {
      hovered = code;
      options.onHover?.(code);
    }
  }

  function onHostMouseOut(ev: MouseEvent): void {
    if (!options.onHover) return;
    // If we're leaving toward another country (or a child path inside one),
    // mouseover on the new target will fire next and update `hovered`. Only
    // fire onHover(null) when leaving the host entirely.
    const related = ev.relatedTarget as Element | null;
    const stillInside = related?.closest("[data-country]");
    if (!stillInside && hovered !== null) {
      hovered = null;
      options.onHover?.(null);
    }
  }

  function buildSvg(raw: string): SVGSVGElement {
    const parsed = new DOMParser().parseFromString(raw, "image/svg+xml");
    const srcSvg = parsed.documentElement;
    const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
    svg.setAttribute(
      "viewBox",
      srcSvg.getAttribute("viewBox") ?? VIEWBOX,
    );
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.classList.add("world-map-svg");

    // Tag every <g id="XX"> and orphan <path id="XX"> with data-country.
    // Inner path elements within a tagged group inherit click delegation
    // via DOM event bubbling.
    const tag = (el: Element) => {
      const id = el.getAttribute("id");
      if (!id) return;
      const code = id.toUpperCase();
      if (!COUNTRIES[code]) return;
      el.setAttribute("data-country", code);
      el.classList.add("world-map-country");
      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = getCountryName(code);
      el.insertBefore(title, el.firstChild);
    };

    for (const node of Array.from(srcSvg.children)) {
      const cloned = node.cloneNode(true) as Element;
      svg.appendChild(cloned);
      if (cloned.tagName.toLowerCase() === "g") tag(cloned);
      // Strip any stale <title>/<desc> sibling text (e.g. "Simple World Map").
      if (
        cloned.tagName.toLowerCase() === "title" ||
        cloned.tagName.toLowerCase() === "desc"
      ) {
        cloned.remove();
      }
    }
    // Country paths may also live outside <g> wrappers in the source SVG.
    for (const path of Array.from(svg.querySelectorAll("path[id]"))) {
      const id = path.getAttribute("id");
      if (id && COUNTRIES[id.toUpperCase()]) tag(path);
    }
    return svg;
  }

  try {
    const res = await fetch(svgUrl);
    if (!res.ok) {
      throw new Error(`world-map fetch ${svgUrl} -> HTTP ${res.status}`);
    }
    const raw = await res.text();
    svgRoot = buildSvg(raw);
    host.appendChild(svgRoot);
    applyFills();
    host.addEventListener("click", onHostClick);
    host.addEventListener("mouseover", onHostMouseOver);
    host.addEventListener("mouseout", onHostMouseOut);
  } catch (err) {
    host.classList.add("world-map-error");
    host.textContent = "Map unavailable";
    // Surface the cause to the consumer via the rejection path.
    throw err instanceof Error ? err : new Error(String(err));
  }

  return {
    element: host,
    setSelected(codes: string[]): void {
      selected = new Set(codes.map(normalize));
      applyFills();
    },
    setSlot(slot: string, codes: string[]): void {
      if (!svgRoot) return;
      const className = sanitizeSlot(slot);
      if (className === null) return;
      const next = new Set<string>(codes.map(normalize));
      const prev = slots.get(className) ?? new Set<string>();
      // Remove the slot class from countries no longer in the set.
      for (const code of prev) {
        if (!next.has(code)) {
          const el = svgRoot.querySelector<SVGElement>(
            `[data-country="${cssEscape(code)}"]`,
          );
          el?.classList.remove(className);
        }
      }
      // Add the slot class to newly included countries.
      for (const code of next) {
        if (!prev.has(code)) {
          const el = svgRoot.querySelector<SVGElement>(
            `[data-country="${cssEscape(code)}"]`,
          );
          el?.classList.add(className);
        }
      }
      if (next.size === 0) slots.delete(className);
      else slots.set(className, next);
    },
    getSelected(): string[] {
      return Array.from(selected);
    },
  };
}

/** Attribute selectors only accept a narrow charset; country codes are
 *  ISO 3166-1 alpha-2 (all letters), so escape just-in-case. */
function cssEscape(value: string): string {
  return value.replace(/(["\\])/g, "\\$1");
}
