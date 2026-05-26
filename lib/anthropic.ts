import Anthropic from "@anthropic-ai/sdk";

// Use a placeholder so the module loads even when the env var is absent.
// A missing/wrong key will produce a 401 from the API, which is caught
// by each route's try/catch and returned as a proper JSON error.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "missing-api-key",
});

export const MODEL = "claude-sonnet-4-6";
