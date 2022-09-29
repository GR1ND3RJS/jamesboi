import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';

function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}

export = {
    name: 'messageDelete',
    callback: async (message) => {
        const timeSinceCreate = Date.now() - message.createdAt.getTime();
        

        if(timeSinceCreate > 1000 * 60 * 60 * 24 ) return;

        if(message.author.bot) return;
        if(message.member.permissions.has('ManageMessages')) return;
        if(message.channel.id === '1023356020250132501') return;

        if(!message.channel.isTextBased() || message.channel.isDMBased()) return

        const channel = message.channel;

        

        const embed = new Discord.EmbedBuilder()
        .setTitle('Message Deleted')
        .setDescription(`A message was deleted ${getUnixTime(Date.now())} in ${channel.name} with the content ${message.content}`)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'messageDelete'>;