import Discord, { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import log from '../auto/log';

export = {
    command: {
        name: 'timeout',
        description: 'Timouts a user',
        options: [
            {
                name: 'user',
                description: 'The user to timeout',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'seconds',
                description: 'Seconds to timeout the user for',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for kicking the user',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
        defaultMemberPermissions: ['KickMembers'],
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: ChatInputCommandInteraction) => {
        const member = interaction.options.getMember('user') as Discord.GuildMember;
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const seconds = interaction.options.getNumber('seconds') as number;
        
        if(!member.kickable) return interaction.editReply({ content: 'The targeted user cannot be given a timeout.' });

        

        member.timeout(seconds, reason).then(() => {
            interaction.editReply(`Successfully given ${member.user.tag} a timeout for \`${reason}\``);

            const embed = new Discord.EmbedBuilder()
            .setTitle(`Gave a timeout to ${member.user.tag}`)
            .setColor('Yellow')
            .setDescription(`Moderator **${interaction.user.tag}** (${interaction.user.id}) has timed out user **${member.user.tag}** \n**Reason:** ${reason}`)
            .setFooter({text: `Moderator ID: ${interaction.user.id}`});

            log({embeds: [embed]});
        }).catch(err => {
            interaction.editReply(`Failed to timeout ${member.user.tag} for \`${reason}\``);
        });
    }
} as CommandFile.FileOptions;

