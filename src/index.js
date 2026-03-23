import { Command } from "commander";
import { makeInitCommand, makeAskCommand, makeSummarizeCommand } from "./commands/index.js";

const program = new Command();

const registerCommands = () => {
  program.addCommand(makeInitCommand());
  program.addCommand(makeAskCommand());
  program.addCommand(makeSummarizeCommand());
};

registerCommands();

program.parse(process.argv);