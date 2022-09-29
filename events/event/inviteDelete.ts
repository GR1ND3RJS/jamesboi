import Discord from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';
function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}
export = {
    name: 'inviteDelete',
    callback: async (invite) => {
        const embed = new Discord.EmbedBuilder()
        .setTitle('Invite Deleted')
        .setDescription(`An invite was deleted ${getUnixTime(Date.now())} in channel ${invite.channel.name} with the code ${invite.code}. \n\n Created by: ${invite.inviter.username}\nUses: ${invite.uses}`)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'inviteDelete'>;