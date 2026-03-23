import { makeCommand } from "../utils/command.js";

export const makeAskCommand = () => {
  const ask = makeCommand("ask");
  ask.action(() => {
    console.log("execute ask command");
  });
  return ask;
};

export default makeAskCommand;
