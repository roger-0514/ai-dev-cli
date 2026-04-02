import { Command } from "commander";
import { expect, test, vi } from "vitest";

import { makeAskCommand } from "../../src/commands/ask.js";
import { ERROR_CODES } from "../../src/errors/error-codes.js";

test("ask: 解析 question 与 --json", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeAskCommand());

  const log = vi.spyOn(console, "log").mockImplementation(() => {});

  try {
    await program.parseAsync(["ask", "--json", "hello"], { from: "user" });

    const cmd = program.commands.find((c) => c.name() === "ask");

    expect(cmd.opts().json).toBe(true);
    expect(log).toHaveBeenCalled();
    const payload = JSON.parse(log.mock.calls[0][0]);
    expect(payload.question).toBe("hello");
    expect(payload.json).toBe(true);
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
