import { makeCommand } from "../utils/command.js";

export const makeInitCommand = () => {
  const init = makeCommand("init");
  init.action(() => {
    console.log("execute init command");
  });
  return init;
};

export default makeInitCommand;
