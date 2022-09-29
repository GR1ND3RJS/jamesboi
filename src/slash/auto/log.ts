import Discord, { CommandInteraction, ApplicationCommandOptionType, ChatInputCommandInteraction, MessagePayload, MessageOptions } from 'discord.js'; 
import { client } from '../../..';
import { server_id } from '../../../config.json'
import LogsSchema from '../../database/LogsSchema';

const log = async (data: MessageOptions ) => {
    const result = await LogsSchema.findOne({ guildId: server_id });
    const channel = client.channels.cache.get(result?.logsChannelId || '123') as Discord.TextChannel;

    if(channel && result?.toggle) {
        channel.send(data);
    }
}


export = log;