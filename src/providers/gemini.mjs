import { GoogleGenAI } from "@google/genai";
import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

export class GeminiProvider {
  constructor(config) {
    this.config = config;
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    this.model = config?.model || "gemini-2.5-flash";
    this.ai = config?.aiClient || new GoogleGenAI(apiKey ? { apiKey } : {});
    this.sleep = config?.sleep || sleep;
    this.retries = Number.isInteger(config?.retries) ? config.retries : 1;
    this.timeout = Number.isInteger(config?.timeout) ? config.timeout : 30000;
  }

  async ask(question) {
    return this.generateText(question);
  }

  async summarize(text) {
    const prompt = `Summarize the following text in concise Chinese:\n\n${text}`;
    return this.generateText(prompt);
  }

  async generateText(contents) {
    let attempt = 0;
    while (attempt <= this.retries) {
      try {
        const config = {
          temperature: this.config.temperature,
        };
        const response = await withTimeout(
          this.ai.models.generateContent({
            model: this.model,
            contents,
            config,
          }),
          this.timeout,
        );
        return response.text ?? "";
      } catch (error) {
        const classified = classifyProviderError(error);
        if (attempt >= this.retries || !classified.retryable) {
          throw createError(classified.code, classified.message, error);
        }
        await this.sleep(backoffMs(attempt));
        attempt += 1;
      }
    }
  }
}

function backoffMs(attempt) {
  return Math.min(1000, 100 * (attempt + 1));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(Object.assign(new Error("Request timeout"), { code: "ETIMEDOUT" }));
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

function classifyProviderError(error) {
  if (error?.code === "ETIMEDOUT") {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: "Gemini request timed out",
      retryable: true,
    };
  }
  if (error?.status === 401 || error?.status === 403 || error?.status === 400) {
    return {
      code: ERROR_CODES.PARAMETER,
      message: "Invalid Gemini request or credentials",
      retryable: false,
    };
  }
  if (error?.status === 429 || (error?.status >= 500 && error?.status < 600)) {
    return {
      code: ERROR_CODES.NETWORK,
      message: "Gemini service is temporarily unavailable",
      retryable: true,
    };
  }
  return {
    code: ERROR_CODES.NETWORK,
    message: "Failed to call Gemini API",
    retryable: true,
  };
}
