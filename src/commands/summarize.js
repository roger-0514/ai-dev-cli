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

export const makeSummarizeCommand = () => {
  const summarize = makeCommand("summarize");
  summarize
    .argument("[text]", "text to summarize")
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .addOption(makeProviderOption())
    .action(async (text, opts, cmd) => {
      if (!text || !String(text).trim()) {
        throw createError(ERROR_CODES.PARAMETER, "Missing required argument: text");
      }

      const config = await resolveConfig(cmd, opts);
      const answer = await createProvider(config).summarize(text);
      if (config.json) {
        console.log(
          normalizeJson(
            "text",
            text,
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
  return summarize;
};



export default makeSummarizeCommand;
