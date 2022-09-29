import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';
function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}
export = {
    name: 'inviteCreate',
    callback: async (invite) => {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Invite Created')
        .setDescription(`An invite was created ${getUnixTime(Date.now())} in channel ${invite.channel.name} with the code ${invite.code}. \n\n Created by: ${invite.inviter.username}`)
        .setColor('Green')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'inviteCreate'>;