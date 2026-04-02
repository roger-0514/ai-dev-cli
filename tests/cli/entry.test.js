import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { expect, test } from "vitest";

import { EXIT_CODES } from "../../src/errors/exit-codes.js";

const execFileAsync = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("入口: ask 缺 question 时进程退出码为 PARAMETER_ERROR", async () => {
  try {
    await execFileAsync("node", [join(root, "src/index.js"), "ask"], {
      cwd: root,
    });
    expect.fail("应抛出子进程错误");
  } catch (error) {
    expect(error.code).toBe(EXIT_CODES.PARAMETER_ERROR);
  }
});
