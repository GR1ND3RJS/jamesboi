import Discord, { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import log from '../auto/log';

export = {
    command: {
        name: 'ban',
        description: 'Ban a user',
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
        defaultMemberPermissions: [ 'BanMembers'],
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: ChatInputCommandInteraction) => {
        const member = interaction.options.getMember('user') as Discord.GuildMember;
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if(!member.bannable ) return interaction.editReply({ content: 'The targeted user cannot be banned.' });


        const banEmbed = new Discord.EmbedBuilder()
        .setTitle(`You have been banned`)
        .setDescription(`You were banned by ${interaction.user.username} for \`${reason}.\`\n\nIf you think this was a mistake, you can write an appeal by clicking on the button below.\n\n**Note:** You can only write one appeal. If your appeal is rejected, you will not be able to write another appeal. If you are banned again, you will not be able to write an appeal as well. This is your only chance to appeal a ban. Admins are able to delete your previous appeal, if they so wish to.`)
        .setColor('Red')
        .setFooter({text: `Moderator ID: ${interaction.user.id}`})
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL({forceStatic: false, size: 2048}));

        await member.send({embeds: [banEmbed]}).catch(e => {
            console.log(e.message)
            return
        })

        member.ban({reason, deleteMessageDays: 3}).then(() => {
            interaction.editReply(`Successfully banned ${member.user.tag} for ${reason}`);

            const embed = new Discord.EmbedBuilder()
            .setTitle(`Banned ${member.user.tag}`)
            .setColor('Red')
            .setDescription(`Moderator **${interaction.user.tag}** (${interaction.user.id}) has banned user **${member.user.tag}** \n**Reason:** ${reason}`)
            .setFooter({text: `Moderator ID: ${interaction.user.id}`});

            log({embeds: [embed]});
        }).catch(err => {
            interaction.editReply(`Failed to kick ${member.user.tag} for ${reason}`);
        });
    }
} as CommandFile.FileOptions;

