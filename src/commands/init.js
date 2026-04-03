import { makeCommand } from "../utils/command.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { DEFAULTS } from "../config/defaults.js";
import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { logger } from "../utils/logger.js";
import { makeProviderOption } from "../options/provider.js";

export const makeInitCommand = () => {
  const init = makeCommand("init");
  init.addOption(makeProviderOption());
  init.action(async () => {
    try {

      if (await exists(path.join(os.homedir(), ".ai-dev-cli", "config.json"))) {
        logger.info("config already exists, skip init");
        return;
      } else {
      await fs.mkdir(path.join(os.homedir(), ".ai-dev-cli"), { recursive: true });

      const config = {
        model: DEFAULTS.model,
        temperature: DEFAULTS.temperature,
        provider: DEFAULTS.provider,
        apiKey: DEFAULTS.apiKey,
        retries: DEFAULTS.retries,
        timeout: DEFAULTS.timeout,
        baseUrl: DEFAULTS.baseUrl,
      };

      await fs.writeFile(path.join(os.homedir(), ".ai-dev-cli", "config.json"), JSON.stringify(config, null, 2));
      logger.info("init completed");
      return;
      }
    } catch (error) {
      throw createError(ERROR_CODES.CONFIG, "Failed to initialize config file", error);
    }
  });
  return init;
};

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

export default makeInitCommand;
