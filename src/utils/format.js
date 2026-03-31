import { createError } from "../errors/cli-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

function normalizeJson(inputKey, inputValue, model, temperature, json, answer) {
  try {
    return JSON.stringify({
      [inputKey]: inputValue,
      model,
      temperature,
      json,
      answer,
    });
  } catch (error) {
    throw createError(ERROR_CODES.PARAMETER, "Invalid JSON format", error);
  }
}

export { normalizeJson };
