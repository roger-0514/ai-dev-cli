import { vi, test, expect, beforeEach } from "vitest";
import { Command } from "commander";
import { DEFAULTS } from "../../src/config/defaults.js";
import {
  mergeLayers,
  readEnvOverrides,
  resolveConfig,
} from "../../src/config/resolve-config.js";
import { makeAskCommand } from "../../src/commands/ask.js";

const { readFileMock } = vi.hoisted(() => ({
  readFileMock: vi.fn(),
}));

vi.mock("node:fs/promises", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    readFile: readFileMock,
  };
});

beforeEach(() => {
  readFileMock.mockReset();
  readFileMock.mockRejectedValue({ code: "ENOENT" });
});

test("mergeLayers: 文件被环境变量覆盖", () => {
  const merged = mergeLayers(
    { model: "file", temperature: 0.5 },
    { model: "env" },
  );
  expect(merged.model).toBe("env");
  expect(merged.temperature).toBe(0.5);
});

test("mergeLayers: 缺省键沿用 DEFAULTS", () => {
  const merged = mergeLayers({}, {});
  expect(merged).toEqual({ ...DEFAULTS });
});

test("readEnvOverrides: 只读取已设置的环境变量", () => {
  const prev = {
    model: process.env.AI_DEV_CLI_MODEL,
    temperature: process.env.AI_DEV_CLI_TEMPERATURE,
    json: process.env.AI_DEV_CLI_JSON,
  };
  try {
    process.env.AI_DEV_CLI_MODEL = "m-env";
    process.env.AI_DEV_CLI_TEMPERATURE = "0.7";
    delete process.env.AI_DEV_CLI_JSON;
    const o = readEnvOverrides();
    expect(o.model).toBe("m-env");
    expect(o.temperature).toBe(0.7);
    expect("json" in o).toBe(false);
  } finally {
    if (prev.model === undefined) {
      delete process.env.AI_DEV_CLI_MODEL;
    } else {
      process.env.AI_DEV_CLI_MODEL = prev.model;
    }
    if (prev.temperature === undefined) {
      delete process.env.AI_DEV_CLI_TEMPERATURE;
    } else {
      process.env.AI_DEV_CLI_TEMPERATURE = prev.temperature;
    }
    if (prev.json === undefined) {
      delete process.env.AI_DEV_CLI_JSON;
    } else {
      process.env.AI_DEV_CLI_JSON = prev.json;
    }
  }
});

test("resolveConfig: CLI --model 覆盖默认值（无配置文件）", async () => {
  const program = new Command();
  program.exitOverride();
  program.addCommand(makeAskCommand());
  await program.parseAsync(
    ["ask", "hello", "-m", "cli-model"],
    { from: "user" },
  );
  const askCmd = program.commands.find((c) => c.name() === "ask");
  const config = await resolveConfig(askCmd, askCmd.opts());
  expect(config.model).toBe("cli-model");
  expect(config.temperature).toBe(DEFAULTS.temperature);
});
