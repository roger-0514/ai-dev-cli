import { test, expect } from "vitest";
import { DEFAULTS } from "../../src/config/defaults.js";
import {
  mergeLayers,
  readEnvOverrides,
} from "../../src/config/resolve-config.js";

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
  process.env.AI_DEV_CLI_MODEL = "m-env";
  process.env.AI_DEV_CLI_TEMPERATURE = "0.7";
  delete process.env.AI_DEV_CLI_JSON;
  const o = readEnvOverrides();
  expect(o.model).toBe("m-env");
  expect(o.temperature).toBe(0.7);
  expect("json" in o).toBe(false);
});
