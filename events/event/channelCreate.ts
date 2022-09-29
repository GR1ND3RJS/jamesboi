import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';

function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}
export = {
    name: 'channelCreate',
    callback: async (channel) => {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Created')
        .setDescription(`A channel was created ${getUnixTime(Date.now())} in category ${channel.parent.name} with the name ${channel.name}`)
        .setColor('Green')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'channelCreate'>;