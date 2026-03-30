import { makeCommand } from "../utils/command.js";
import {
  makeModelOption,
  makeTemperatureOption,
  makeJsonOption,
} from "../options/model.js";
import { resolveConfig } from "../config/resolve-config.js";
import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { logger } from "../utils/logger.js";

export const makeSummarizeCommand = () => {
  const summarize = makeCommand("summarize");
  summarize
    .argument("[text]", "text to summarize")
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .action(async (text, opts, cmd) => {
      if (!text || !String(text).trim()) {
        throw createError(ERROR_CODES.PARAMETER, "Missing required argument: text");
      }

      const config = await resolveConfig(cmd, opts);
      logger.info("execute summarize command", { text, config });
    });
  return summarize;
};

export default makeSummarizeCommand;
