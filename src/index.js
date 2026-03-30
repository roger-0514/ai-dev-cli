import { Command } from "commander";
import { makeInitCommand, makeAskCommand, makeSummarizeCommand } from "./commands/index.js";
import { isCliError } from "./errors/cli-error.js";
import { ERROR_CODES } from "./errors/error-codes.js";
import { EXIT_CODES, toExitCode } from "./errors/exit-codes.js";
import { logger } from "./utils/logger.js";

const program = new Command();

const registerCommands = () => {
  program.addCommand(makeInitCommand());
  program.addCommand(makeAskCommand());
  program.addCommand(makeSummarizeCommand());
};

registerCommands();

async function main() {
  try {
    await program.parseAsync(process.argv);
    process.exitCode = EXIT_CODES.OK;
  } catch (error) {
    if (isCliError(error)) {
      logger.error(`[${error.code}] ${error.message}`);
      process.exitCode = toExitCode(error.code);
      return;
    }

    const unknown = /** @type {Error} */ (error);
    logger.error(`[${ERROR_CODES.UNKNOWN}] ${unknown.message}`);
    process.exitCode = EXIT_CODES.GENERAL_ERROR;
  }
}

main();