import Discord, { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import log from '../auto/log';

export = {
    command: {
        name: 'kick',
        description: 'Kick a user',
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: ApplicationCommandOptionType.User,
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
        
        if(!member.kickable) return interaction.editReply({ content: 'The targeted user cannot be kicked.' });

        const kickEmbed = new Discord.EmbedBuilder()
        .setTitle(`You have been kicked`)
        .setDescription(`You were kicked by ${interaction.user.username} for \`${reason}.\`\n\nIf you think this was a mistake, you can rejoin the server after 5 minutes.`)
        .setColor('Yellow')
        .setFooter({text: `Moderator ID: ${interaction.user.id}`})
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL({forceStatic: false, size: 2048}));

        await member.send({embeds: [kickEmbed]}).catch(e => {
            console.log(e.message)
            return
        })

        member.kick(reason).then(() => {
            interaction.editReply(`Successfully kicked ${member.user.tag} for ${reason}`);

            const embed = new Discord.EmbedBuilder()
            .setTitle(`Kicked ${member.user.tag}`)
            .setColor('Yellow')
            .setDescription(`Moderator **${interaction.user.tag}** (${interaction.user.id}) has kicked user **${member.user.tag}** \n**Reason:** ${reason}`)
            .setFooter({text: `Moderator ID: ${interaction.user.id}`});

            log({embeds: [embed]});
        }).catch(err => {
            interaction.editReply(`Failed to kick ${member.user.tag} for ${reason}`);
        });
    }
} as CommandFile.FileOptions;

