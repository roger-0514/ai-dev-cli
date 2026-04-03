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
import { normalizeJson } from "../utils/format.js";
import { makeProviderOption } from "../options/provider.js";

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
      const { model, temperature, json, provider } = config;
      const answer = mockSummarize(text, model, temperature, json, provider);
      if (json) {
        console.log(answer);
        return;
      }
      logger.info("summarize answer", answer);
      logger.info("execute summarize command", { text, config });
    });
  return summarize;
};

function mockSummarize(text, model, temperature, json, provider) {
  let answer = "hi this is a mock summarize answer";
  if (json) {
    answer = normalizeJson(
      "text",
      text,
      model,
      temperature,
      json,
      answer,
      provider,
    );
  }
  return answer;
}

export default makeSummarizeCommand;
