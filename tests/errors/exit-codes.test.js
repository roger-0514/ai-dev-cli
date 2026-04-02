import { test, expect } from "vitest";
import { ERROR_CODES } from "../../src/errors/error-codes.js";
import { EXIT_CODES, toExitCode } from "../../src/errors/exit-codes.js";

test("toExitCode: 映射已知错误码", () => {
  expect(toExitCode(ERROR_CODES.CONFIG)).toBe(EXIT_CODES.CONFIG_ERROR);
  expect(toExitCode(ERROR_CODES.NETWORK)).toBe(EXIT_CODES.NETWORK_ERROR);
  expect(toExitCode(ERROR_CODES.TIMEOUT)).toBe(EXIT_CODES.TIMEOUT_ERROR);
  expect(toExitCode(ERROR_CODES.PARAMETER)).toBe(EXIT_CODES.PARAMETER_ERROR);
  expect(toExitCode(ERROR_CODES.UNKNOWN)).toBe(EXIT_CODES.GENERAL_ERROR);
});

test("toExitCode: 未知错误码回退为 GENERAL_ERROR", () => {
  expect(toExitCode("E_NOT_REAL")).toBe(EXIT_CODES.GENERAL_ERROR);
});
