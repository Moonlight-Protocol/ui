/**
 * Wraps a nav element and content in the shared page-layout shape:
 *
 *   <div>
 *     {nav}
 *     <main class="container">{content}</main>
 *   </div>
 *
 * Auth checks, redirects, and router integration live in the consumer.
 * `pageLayout` is a layout primitive — it does not know about routing or auth.
 */
export function pageLayout(
  nav: HTMLElement,
  content: HTMLElement,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.appendChild(nav);

  const main = document.createElement("main");
  main.className = "container";
  main.appendChild(content);
  wrapper.appendChild(main);

  return wrapper;
}
