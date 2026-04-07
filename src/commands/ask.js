import { makeCommand } from "../utils/command.js";
import {
  makeModelOption,
  makeTemperatureOption,
  makeJsonOption,
} from "../options/model.js";
import { resolveConfig } from "../config/resolve-config.js";
import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { makeProviderOption } from "../options/provider.js";
import { createProvider } from "../providers/index.js";
import { normalizeJson } from "../utils/format.js";

export const makeAskCommand = () => {
  const ask = makeCommand("ask");
  ask
    .argument("[question]", "question text")
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .addOption(makeProviderOption())
    .action(async (question, opts, cmd) => {
      if (!question || !String(question).trim()) {
        throw createError(
          ERROR_CODES.PARAMETER,
          "Missing required argument: question",
        );
      }

      const config = await resolveConfig(cmd, opts);
      const answer = await createProvider(config).ask(question);
      if (config.json) {
        console.log(
          normalizeJson(
            "question",
            question,
            config.model,
            config.temperature,
            config.json,
            answer,
            config.provider,
          ),
        );
        return;
      }
      console.log(answer);
    });
  return ask;
};

export default makeAskCommand;
