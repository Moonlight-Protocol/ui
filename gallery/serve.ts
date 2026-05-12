import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";
import { contentType } from "@std/media-types";
import { extname, fromFileUrl, join, normalize } from "@std/path";

const ROOT = fromFileUrl(new URL("..", import.meta.url));
const PORT = Number(Deno.env.get("PORT") ?? "8000");
const GALLERY_ENTRY = join(ROOT, "gallery/main.ts");

async function bundleGallery(): Promise<string> {
  const result = await esbuild.build({
    plugins: [
      ...denoPlugins({
        configPath: join(ROOT, "deno.json"),
      }),
    ],
    entryPoints: [GALLERY_ENTRY],
    bundle: true,
    format: "esm",
    write: false,
    sourcemap: "inline",
    platform: "browser",
  });
  return new TextDecoder().decode(result.outputFiles[0].contents);
}

let cachedBundle: string | null = null;

function resolveStatic(pathname: string): string | null {
  const rel = pathname.replace(/^\/+/, "");
  if (!rel) return join(ROOT, "gallery/index.html");
  const resolved = normalize(join(ROOT, rel));
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

console.log(`Gallery server starting on http://localhost:${PORT}`);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/gallery.js") {
    if (!cachedBundle) {
      cachedBundle = await bundleGallery();
    }
    return new Response(cachedBundle, {
      headers: { "content-type": "application/javascript" },
    });
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = await Deno.readTextFile(join(ROOT, "gallery/index.html"));
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const filePath = resolveStatic(url.pathname);
  if (!filePath) return new Response("forbidden", { status: 403 });

  try {
    const body = await Deno.readFile(filePath);
    const ct = contentType(extname(filePath)) ?? "application/octet-stream";
    return new Response(body, { headers: { "content-type": ct } });
  } catch {
    return new Response("not found", { status: 404 });
  }
});
