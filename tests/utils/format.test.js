import { test, expect } from "vitest";
import { normalizeJson } from "../../src/utils/format.js";

test("normalizeJson: ask 场景使用 question 键", () => {
  const line = normalizeJson(
    "question",
    "hello",
    "m",
    0.5,
    true,
    "ans",
    "openai",
  );
  expect(JSON.parse(line)).toEqual({
    question: "hello",
    model: "m",
    temperature: 0.5,
    json: true,
    provider: "openai",
    answer: "ans",
  });
});

test("normalizeJson: summarize 场景使用 text 键", () => {
  const line = normalizeJson("text", "body", "m", 0.1, true, "sum", "openai");
  expect(JSON.parse(line)).toEqual({
    text: "body",
    model: "m",
    temperature: 0.1,
    json: true,
    provider: "openai",
    answer: "sum",
  });
});
