import { fromFileUrl } from "@std/path";

export function baseStylesCssPath(): string {
  return fromFileUrl(new URL("./base-styles.css", import.meta.url));
}

export async function readBaseStylesCss(): Promise<string> {
  return await Deno.readTextFile(baseStylesCssPath());
}
