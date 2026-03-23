import { Command } from "commander";

export const makeCommand = (command) => {
  return new Command(command);
};
