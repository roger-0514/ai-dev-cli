import { mkdtemp, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Command } from "commander";
import { expect, test } from "vitest";

import { makeInitCommand } from "../../src/commands/init.js";
import { DEFAULTS } from "../../src/config/defaults.js";

test("init: 首次创建配置文件；再次执行跳过", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ai-dev-cli-init-"));
  const prevHome = process.env.HOME;
  process.env.HOME = dir;

  try {
    const program = new Command();
    program.exitOverride();
    program.addCommand(makeInitCommand());

    await program.parseAsync(["init"], { from: "user" });

    const raw = await readFile(join(dir, ".ai-dev-cli", "config.json"), "utf8");
    const data = JSON.parse(raw);
    expect(data.model).toBe(DEFAULTS.model);
    expect(data.temperature).toBe(DEFAULTS.temperature);

    await program.parseAsync(["init"], { from: "user" });
  } finally {
    if (prevHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = prevHome;
    }
    await rm(dir, { recursive: true, force: true });
  }
});
