import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';

function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}

export = {
    name: 'messageUpdate',
    callback: async (oldMessage, newMessage) => {
        const timeSinceUpdate = Date.now() - oldMessage.createdAt.getTime();
        

        if(timeSinceUpdate > 1000 * 60 * 60 * 24 ) return;

        if(!oldMessage.channel.isTextBased() || oldMessage.channel.isDMBased()) return

        const embed = new Discord.EmbedBuilder()
        .setTitle('Message Updated')
        .setDescription(`A message was updated ${getUnixTime(Date.now())} in ${oldMessage.channel.name} by ${oldMessage.author.username}.\n\nOld content: ${oldMessage.content}\nNew content: ${newMessage.content}`)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'messageUpdate'>;