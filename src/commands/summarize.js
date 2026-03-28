import { makeCommand } from "../utils/command.js";
import {
  makeModelOption,
  makeTemperatureOption,
  makeJsonOption,
} from "../options/model.js";
import { resolveConfig } from "../config/resolve-config.js";

export const makeSummarizeCommand = () => {
  const summarize = makeCommand("summarize");
  summarize
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .action(async (opts, cmd) => {
      const config = await resolveConfig(cmd, opts);
      console.log("execute summarize command", config);
    });
  return summarize;
};

export default makeSummarizeCommand;
