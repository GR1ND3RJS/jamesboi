import Discord, { CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import readCmds from '../../readCmds';
import { version }  from '../../../package.json';

export = {
    command: {
        name: 'serverstats',
        description: 'Shows the setver stats',
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: CommandInteraction) => {
        const server = interaction.guild;
        const owner = await server.members.fetch(server.ownerId);

        const embed = new Discord.EmbedBuilder()
            .setTitle('Server Stats')
            .setColor('Random')
            .addFields([
                {
                    name: 'Age',
                    value: `<t:${Math.floor(new Date(server.createdAt).getTime() / 1000)}:R>`,
                },
                {
                    name: 'Members',
                    value: `\`${server.memberCount} members\``,
                },
                {
                    name: 'Roles',
                    value: `\`${server.roles.cache.size} roles\``,
                },
                {
                    name: 'Channels',
                    value: `\`${server.channels.cache.size} channels\``,
                },
                {
                    name: 'Latest Banned Member',
                    value: `\`${server.bans.cache.first()?.user.username || 'None'}\``,
                },
                {
                    name: 'Latest Kicked Member',
                    value: `\`${server.members.cache.first()?.user.username}\``,
                },
                {
                    name: 'Owner',
                    value: `\`${owner.user.tag}\``,
                },
            ])
            .setTimestamp()
            .setThumbnail(server.iconURL({ forceStatic: false }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

        interaction.editReply({ embeds: [embed] });
    }
} as CommandFile.FileOptions;