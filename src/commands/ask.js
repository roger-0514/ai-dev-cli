import { makeCommand } from "../utils/command.js";
import {
  makeModelOption,
  makeTemperatureOption,
  makeJsonOption,
} from "../options/model.js";
import { resolveConfig } from "../config/resolve-config.js";

export const makeAskCommand = () => {
  const ask = makeCommand("ask");
  ask
    .addOption(makeModelOption())
    .addOption(makeTemperatureOption())
    .addOption(makeJsonOption())
    .action(async (opts, cmd) => {
      const config = await resolveConfig(cmd, opts);
      console.log("execute ask command", config);
    });
  return ask;
};

export default makeAskCommand;
