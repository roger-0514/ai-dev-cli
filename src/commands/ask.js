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
      //  1.use model
      //  2.use temperature
      //  3.use json
      const { model, temperature, json, provider } = config;
      //  4.return answer
      const answer = mockAnswer(question, model, temperature, json, provider);
      if (json) {
        console.log(answer);
        return;
      }

      logger.info("answer", answer);

      logger.info("execute ask command", { question, config });
    });
  return ask;
};

function mockAnswer(question, model, temperature, json, provider) {
  let answer = "hi this is a mock answer";
  if (json) {
    answer = normalizeJson(
      "question",
      question,
      model,
      temperature,
      json,
      answer,
      provider,
    );
  }
  return answer;
}

export default makeAskCommand;
