import { makeCommand } from "../utils/command.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { DEFAULTS } from "../config/defaults.js";

export const makeInitCommand = () => {
  const init = makeCommand("init");
  init.action(async () => {
    if(await exists(path.join(os.homedir(), ".ai-dev-cli", "config.json"))){
      return
    }else{

      await fs.mkdir(path.join(os.homedir(), ".ai-dev-cli"), { recursive: true });

      const config = {
        model: DEFAULTS.model,
        temperature: DEFAULTS.temperature,
      };

      await fs.writeFile(path.join(os.homedir(), ".ai-dev-cli", "config.json"), JSON.stringify(config, null, 2));
      
      return;
    }})
  return init;
};

async function exists(path){
  try{
    await fs.access(path);
    return true;
  }catch(error){
    return false;
  }
}

export default makeInitCommand;
