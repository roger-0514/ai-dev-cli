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

export const makeAskCommand = () => {
  const ask = makeCommand("ask");
  ask
    .argument("[question]", "question text")
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .action(async (question, opts, cmd) => {
      if (!question || !String(question).trim()) {
        throw createError(
          ERROR_CODES.PARAMETER,
          "Missing required argument: question",
        );
      }

      const config = await resolveConfig(cmd, opts);
      logger.info("execute ask command", { question, config });
    });
  return ask;
};

export default makeAskCommand;
