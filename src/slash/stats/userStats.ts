import Discord, { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import readCmds from '../../readCmds';
import { version }  from '../../../package.json';
import { client } from '../../..';

export = {
    command: {
        name: 'userstats',
        description: 'Shows the user\'s stats',
        options: [{
            name: 'user',
            description: 'The user to get the stats of',
            type: ApplicationCommandOptionType.User,
            required: true,
        }]
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: ChatInputCommandInteraction) => {
        const member = interaction.options.getMember('user') as Discord.GuildMember;
        const user = await client.users.fetch(member.user.id, {force: true});
        

        let roles = member.roles.cache.map(role => {
            if(role.id !== interaction.guildId) return role;
        }).sort((a, b) => {
            return b.position - a.position;
        }).join(' | ').trimEnd()

        

        roles = roles.slice(0, roles.length -1)
        const flags = member.user.flags.toArray().join(' | ');
        const banner = user.bannerURL({ forceStatic: false, size: 2048 });

        const embed = new Discord.EmbedBuilder()
            .setTitle('Server Stats')
            .setColor('Random')
            .addFields([
                {
                    name: 'Name',
                    value: `\`${member.user.tag}\``,
                }, 
                {
                    name: 'Account Joined',
                    value: `<t:${Math.floor(new Date(member.joinedAt).getTime() / 1000)}:R>`,
                }, 
                {
                    name: 'Account Created',
                    value: `<t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R>`,
                },
                {
                    name: 'Flags',
                    value: `\`${flags || 'None'}\``,
                },
                {
                    name: 'Highest Role',
                    value: `\`${member.roles.highest.name}\``,
                },
                {
                    name: 'Roles',
                    value: `${roles}`,
                },
                {
                    name: 'Warns',
                    value: `\`0\``,
                }
            ])
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL({ forceStatic: false }))
            .setImage(banner)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

        interaction.editReply({ embeds: [embed] });
    }
} as CommandFile.FileOptions;