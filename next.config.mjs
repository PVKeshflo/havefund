import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === "edge") {
      const stub = resolve(__dirname, "lib/node-stub.js");
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:child_process": stub,
        "node:crypto": stub,
        "node:fs": stub,
        "node:fs/promises": stub,
        "node:path": stub,
        "node:os": stub,
        "node:net": stub,
        "node:tls": stub,
        "node:stream": stub,
      };
    }
    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
