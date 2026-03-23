import { makeCommand } from "../utils/command.js";

export const makeSummarizeCommand = () => {
  const summarize = makeCommand("summarize");
  summarize.action(() => {
    console.log("execute summarize command");
  });
  return summarize;
};

export default makeSummarizeCommand;