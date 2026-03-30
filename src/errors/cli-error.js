import { ERROR_CODES } from "./error-codes.js";

export class CliError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "CliError";
    this.code = code ?? ERROR_CODES.UNKNOWN;
    this.cause = cause;
  }
}

export function createError(code, message, cause) {
  return new CliError(code, message, cause);
}

export function isCliError(error) {
  return error instanceof CliError;
}