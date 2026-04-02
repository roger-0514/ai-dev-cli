import { Command } from "commander";
import { expect, test, vi } from "vitest";

import { makeSummarizeCommand } from "../../src/commands/summarize.js";
import { ERROR_CODES } from "../../src/errors/error-codes.js";

test("summarize: 解析 text 与 --json", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeSummarizeCommand());

  const log = vi.spyOn(console, "log").mockImplementation(() => {});

  try {
    await program.parseAsync(["summarize", "--json", "text"], { from: "user" });

    const cmd = program.commands.find((c) => c.name() === "summarize");

    expect(cmd.opts().json).toBe(true);
    expect(log).toHaveBeenCalled();
    const payload = JSON.parse(log.mock.calls[0][0]);
    expect(payload.text).toBe("text");
    expect(payload.json).toBe(true);
  } finally {
    log.mockRestore();
  }
});

test("summarize: 缺少 text 抛出 E_PARAMETER", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeSummarizeCommand());

  await expect(
    program.parseAsync(["summarize"], { from: "user" }),
  ).rejects.toMatchObject({ code: ERROR_CODES.PARAMETER });
});
