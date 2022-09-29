import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';
function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}
export = {
    name: 'channelDelete',
    callback: async (channel: Discord.NonThreadGuildBasedChannel) => {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Deleted')
        .setDescription(`A channel was deleted ${getUnixTime(Date.now())} from category ${channel.parent.name} with the name ${channel.name}.`)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'channelDelete'>;