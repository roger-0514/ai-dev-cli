import { Option } from "commander";

const makeProviderOption = () => {
  return new Option("-p, --provider <provider>", "specify the provider to use")
};

export { makeProviderOption };