import { describe, expect, test, vi } from "vitest";
import { GeminiProvider } from "../../src/providers/gemini.mjs";
import { ERROR_CODES } from "../../src/errors/error-codes.js";

function makeProvider(overrides = {}) {
  return new GeminiProvider({
    provider: "gemini",
    model: "gemini-2.5-flash",
    temperature: 0.2,
    timeout: 20,
    retries: 1,
    ...overrides,
  });
}

describe("GeminiProvider", () => {
  test("ask: 返回模型文本", async () => {
    const generateContent = vi.fn().mockResolvedValue({ text: "hello" });
    const provider = makeProvider({
      aiClient: { models: { generateContent } },
    });

    await expect(provider.ask("hi")).resolves.toBe("hello");
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  test("超时错误: 重试后抛 E_TIMEOUT", async () => {
    const err = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
    const generateContent = vi.fn().mockRejectedValue(err);
    const provider = makeProvider({
      retries: 2,
      aiClient: { models: { generateContent } },
      sleep: vi.fn().mockResolvedValue(undefined),
    });

    await expect(provider.ask("hi")).rejects.toMatchObject({
      code: ERROR_CODES.TIMEOUT,
    });
    expect(generateContent).toHaveBeenCalledTimes(3);
  });

  test("401 错误: 不重试并抛 E_PARAMETER", async () => {
    const err = Object.assign(new Error("unauthorized"), { status: 401 });
    const generateContent = vi.fn().mockRejectedValue(err);
    const provider = makeProvider({
      retries: 2,
      aiClient: { models: { generateContent } },
    });

    await expect(provider.ask("hi")).rejects.toMatchObject({
      code: ERROR_CODES.PARAMETER,
    });
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  test("429 错误: 会重试", async () => {
    const firstErr = Object.assign(new Error("rate limit"), { status: 429 });
    const generateContent = vi
      .fn()
      .mockRejectedValueOnce(firstErr)
      .mockResolvedValueOnce({ text: "ok" });
    const provider = makeProvider({
      retries: 2,
      aiClient: { models: { generateContent } },
      sleep: vi.fn().mockResolvedValue(undefined),
    });

    await expect(provider.ask("hi")).resolves.toBe("ok");
    expect(generateContent).toHaveBeenCalledTimes(2);
  });
});
