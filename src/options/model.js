import { Option } from "commander";

const makeModelOption = () => {
  return new Option("-m, --model <model>", "specify the model to use").default(
    "gpt-4.1",
  );
};

const makeTemperatureOption = () => {
  return new Option(
    "-t, --temperature <temperature>",
    "specify the temperature to use",
  )
    .default("0.2")
    .argParser((v) => parseFloat(v, 10));
};

const makeJsonOption = () => {
  return new Option("--json", "output the result in json format");
};

export { makeModelOption, makeTemperatureOption, makeJsonOption };
