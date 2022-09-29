import Discord, { CacheType, PermissionsString } from "discord.js";
import { CommandFile } from "./types";
import { image_data } from '../config.json';


export default async function runCmds(
  client: Discord.Client,
  option: CommandFile.EventOptions
) {
  console.log(`Loaded event ${option.name}`);
  client.on(option.name, (...args) => {
    console.log('fired')
    option.callback(...args);
  })

}
