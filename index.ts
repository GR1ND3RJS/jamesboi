/* Imports */
import Discord from 'discord.js';
import dotenv from 'dotenv';

/* File Imports */

import readCmds from './src/readCmds';
import createCmds from './src/createCmds';
import mongo from './mongo';
import readEvents from './events/readEvents';
import updateVerification from './src/slash/auto/updateVerification';
import { verification_interval } from './config.json'


/* Initialization */

dotenv.config()



export const client = new Discord.Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMessageReactions', 'GuildMessageTyping', 'GuildMembers', 'DirectMessages', 'GuildMessages', 'GuildPresences', 'GuildBans', 'GuildInvites', 'MessageContent', 'GuildVoiceStates', 'GuildWebhooks']
});




/* Startup */
const intervalTime = 1000 * 60 * 60 * verification_interval;

client.on('ready', () => {
    createCmds(client)
    readCmds(client)
    readEvents(client)
    mongo({ uri: process.env.MONGO_URI })
    updateVerification()
    setInterval(updateVerification, intervalTime)
})



client.login(process.env.DISCORD_BOT_TOKEN)

// NOTHING IN THIS FILE SHOULD BE CHANGED. ONLY DO SO IF YOU KNOW WHAT YOU ARE DOING.

