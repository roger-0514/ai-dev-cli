import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { GeminiProvider } from "./gemini.mjs";

export class BaseProvider {
  constructor(config) {
    this.config = config;
  }

  async generateText(contents) {
    throw createError(ERROR_CODES.UNKNOWN, "generateText() is not implemented");
  }
}

export function createProvider(config) {
  if (config?.provider === "gemini") {
    return new GeminiProvider(config);
  }
  throw createError(ERROR_CODES.PARAMETER, `Unsupported provider: ${config?.provider ?? "unknown"}`);
}

