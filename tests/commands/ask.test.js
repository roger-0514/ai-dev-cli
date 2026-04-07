import { Command } from "commander";
import { expect, test, vi } from "vitest";

const askMock = vi.fn();
vi.mock("../../src/providers/index.js", () => ({
  createProvider: () => ({ ask: askMock }),
}));

import { makeAskCommand } from "../../src/commands/ask.js";
import { DEFAULTS } from "../../src/config/defaults.js";
import { ERROR_CODES } from "../../src/errors/error-codes.js";

test("ask: 解析 question 与 --json", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeAskCommand());

  const log = vi.spyOn(console, "log").mockImplementation(() => {});

  try {
    askMock.mockResolvedValue("provider answer");
    await program.parseAsync(["ask", "--json", "hello"], { from: "user" });

    const cmd = program.commands.find((c) => c.name() === "ask");

    expect(cmd.opts().json).toBe(true);
    expect(log).toHaveBeenCalled();
    const payload = JSON.parse(log.mock.calls[0][0]);
    expect(payload.question).toBe("hello");
    expect(payload.json).toBe(true);
    expect(payload.provider).toBe(DEFAULTS.provider);
  } finally {
    log.mockRestore();
  }
});

test("ask: --json 与 -p 写入 payload.provider", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeAskCommand());

  const log = vi.spyOn(console, "log").mockImplementation(() => {});

  try {
    askMock.mockResolvedValue("provider answer");
    await program.parseAsync(
      ["ask", "--json", "-p", "anthropic", "hello"],
      { from: "user" },
    );

    expect(log).toHaveBeenCalled();
    const payload = JSON.parse(log.mock.calls[0][0]);
    expect(payload.provider).toBe("anthropic");
    expect(payload.question).toBe("hello");
  } finally {
    log.mockRestore();
  }
});

test("ask: 缺少 question 抛出 E_PARAMETER", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeAskCommand());

  await expect(program.parseAsync(["ask"], { from: "user" })).rejects.toMatchObject(
    { code: ERROR_CODES.PARAMETER },
  );
});
