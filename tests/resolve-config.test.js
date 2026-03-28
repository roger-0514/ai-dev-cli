import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULTS } from "../src/config/defaults.js";
import {
  mergeLayers,
  readEnvOverrides,
} from "../src/config/resolve-config.js";

test("mergeLayers: 文件被环境变量覆盖", () => {
  const merged = mergeLayers(
    { model: "file", temperature: 0.5 },
    { model: "env" },
  );
  assert.equal(merged.model, "env");
  assert.equal(merged.temperature, 0.5);
});

test("mergeLayers: 缺省键沿用 DEFAULTS", () => {
  const merged = mergeLayers({}, {});
  assert.deepEqual(merged, { ...DEFAULTS });
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
  try {
    const o = readEnvOverrides();
    assert.equal(o.model, "m-env");
    assert.equal(o.temperature, 0.7);
    assert.equal("json" in o, false);
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
