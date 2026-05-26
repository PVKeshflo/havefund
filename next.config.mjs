import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { nextRuntime, webpack }) => {
    // Only stub node: imports on Cloudflare Pages builds.
    // Vercel's edge runtime handles node: natively; applying the stub there
    // replaces Vercel's own polyfills and breaks the Anthropic SDK at load time.
    if (nextRuntime === "edge" && !process.env.VERCEL) {
      const stub = resolve(__dirname, "lib/node-stub.js");

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = stub;
          }
        )
      );
    }
    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
