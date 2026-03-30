import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { DEFAULTS } from "./defaults.js";
import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

const CONFIG_DIR = ".ai-dev-cli";
const CONFIG_NAME = "config.json";

/** 与 init 写入的字段及 CLI 对齐 */
const ENV = {
  model: "AI_DEV_CLI_MODEL",
  temperature: "AI_DEV_CLI_TEMPERATURE",
  json: "AI_DEV_CLI_JSON",
};

export function getConfigPath() {
  return path.join(os.homedir(), CONFIG_DIR, CONFIG_NAME);
}

function parseEnvBool(value) {
  return /^(1|true|yes|on)$/i.test(String(value).trim());
}

/**
 * 从环境变量读取（未设置的键不出现在结果里，由调用方与默认值合并）。
 */
export function readEnvOverrides() {
  const out = {};
  const m = process.env[ENV.model];
  if (m !== undefined && m !== "") {
    out.model = m;
  }
  const t = process.env[ENV.temperature];
  if (t !== undefined && t !== "") {
    const n = parseFloat(t, 10);
    if (!Number.isNaN(n)) {
      out.temperature = n;
    }
  }
  const j = process.env[ENV.json];
  if (j !== undefined && j !== "") {
    out.json = parseEnvBool(j);
  }
  return out;
}

/**
 * 读取 ~/.ai-dev-cli/config.json；不存在则返回 {}。
 */
export async function loadConfigFile() {
  const configPath = getConfigPath();
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const data = JSON.parse(raw);
    return pickConfigFields(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return {};
    }
    throw createError(
      ERROR_CODES.CONFIG,
      `Failed to load config file: ${configPath}`,
      err,
    );
  }
}

function pickConfigFields(data) {
  if (data === null || typeof data !== "object") {
    return {};
  }
  const out = {};
  if (typeof data.model === "string") {
    out.model = data.model;
  }
  if (typeof data.temperature === "number" && !Number.isNaN(data.temperature)) {
    out.temperature = data.temperature;
  }
  if (typeof data.json === "boolean") {
    out.json = data.json;
  }
  return out;
}

const OPTION_KEYS = ["model", "temperature", "json"];

/**
 * 默认值 → 配置文件 → 环境变量（不含 CLI）。
 */
export function mergeLayers(fileConfig, envOverrides) {
  return {
    ...DEFAULTS,
    ...fileConfig,
    ...envOverrides,
  };
}

function applyCliOverrides(command, opts, merged) {
  const next = { ...merged };
  for (const key of OPTION_KEYS) {
    const source = command.getOptionValueSource(key);
    if (source === "cli") {
      next[key] = opts[key];
    }
  }
  return next;
}

/**
 * 合并顺序：默认值 < 配置文件 < 环境变量 < 命令行（仅当 getOptionValueSource 为 cli）。
 *
 * @param {import("commander").Command} command 当前子命令实例（action 回调第二个参数）
 * @param {Record<string, unknown>} opts Commander 解析后的 opts
 */
export async function resolveConfig(command, opts) {
  const file = await loadConfigFile();
  const env = readEnvOverrides();
  const merged = mergeLayers(file, env);
  return applyCliOverrides(command, opts, merged);
}
