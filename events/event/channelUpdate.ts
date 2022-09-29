import Discord, { ChannelType } from 'discord.js';
import log from '../../src/slash/auto/log';
import { CommandFile } from '../types';

function getUnixTime(time: number) {
    return Math.floor(time / 1000);
}
export = {
    name: 'channelUpdate',
    callback: async (oldChannel: Discord.NonThreadGuildBasedChannel, newChannel: Discord.NonThreadGuildBasedChannel) => {

        if(!oldChannel.isTextBased() || !newChannel.isTextBased()) return;

        if(oldChannel.type === ChannelType.GuildVoice || newChannel.type === ChannelType.GuildVoice) return;

        const newPerms: Discord.PermissionOverwrites[] = []

        oldChannel.permissionOverwrites.cache.forEach((oldPermission, i) => {
            newChannel.permissionOverwrites.cache.forEach((newPermission, j) => {
                if(oldPermission.id === newPermission.id) {
                    if(oldPermission.allow.bitfield !== newPermission.allow.bitfield) {
                        newPerms.push(newPermission);
                    }
                }
            })
        })

        const changesText = `
        **Changes**\n\n
        ${oldChannel.name !== newChannel.name ? `Name: ${oldChannel.name} -> ${newChannel.name}\n` : ''}
        ${oldChannel.parentId !== newChannel.parentId ? `Category: ${oldChannel.parent.name} -> ${newChannel.parent.name}\n` : ''}
        ${oldChannel.topic !== newChannel.topic ? `Topic: ${oldChannel.topic} -> ${newChannel.topic}\n` : ''}
        ${oldChannel.nsfw !== newChannel.nsfw ? `NSFW: ${oldChannel.nsfw} -> ${newChannel.nsfw}\n` : ''}
        ${oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser ? `Slowmode: ${oldChannel.rateLimitPerUser} -> ${newChannel.rateLimitPerUser}\n` : ''}
        ${oldChannel.position !== newChannel.position ? `Position: ${oldChannel.position} -> ${newChannel.position}\n` : ''}
        ${oldChannel.type !== newChannel.type ? `Type: ${oldChannel.type} -> ${newChannel.type}\n` : ''}
        ${oldChannel.permissionOverwrites !== newChannel.permissionOverwrites ? `Permissions: ${oldChannel.permissionOverwrites} -> ${newChannel.permissionOverwrites}\n\n` : ''}
        ${newPerms.map((perm) => {return `New permission: ${perm.id} -> ${perm.allow.bitfield}\n`})}
        `; 

        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Created')
        .setDescription(`A channel was update ${getUnixTime(Date.now())} in category ${oldChannel.parent.name} with the name ${oldChannel.name}.\n${changesText}`)
        .setColor('Green')
        .setTimestamp();

        log({ embeds: [embed] });
    }
} as CommandFile.EventOptions<'channelUpdate'>;