import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

function normalizeJson(
  inputKey,
  inputValue,
  model,
  temperature,
  json,
  answer,
  provider,
) {
  try {
    return JSON.stringify({
      [inputKey]: inputValue,
      model,
      temperature,
      json,
      provider,
      answer,
    });
  } catch (error) {
    throw createError(ERROR_CODES.PARAMETER, "Invalid JSON format", error);
  }
}

export { normalizeJson };
