import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === "edge") {
      const stub = resolve(__dirname, "lib/node-stub.js");

      // Anthropic SDK v0.98 optional sub-modules import node:child_process,
      // node:crypto, node:fs, node:path etc. which webpack can't bundle for
      // the edge runtime. Replace every node: URI import with an empty stub.
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
