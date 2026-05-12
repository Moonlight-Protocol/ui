import { fromFileUrl } from "@std/path";

export const TOKEN_NAMES = [
  "--bg",
  "--surface",
  "--border",
  "--text",
  "--text-muted",
  "--primary",
  "--primary-hover",
  "--active",
  "--pending",
  "--inactive",
  "--font-mono",
  "--font-sans",
] as const;

export type TokenName = typeof TOKEN_NAMES[number];

export function tokensCssPath(): string {
  return fromFileUrl(new URL("./tokens.css", import.meta.url));
}

export async function readTokensCss(): Promise<string> {
  return await Deno.readTextFile(tokensCssPath());
}
