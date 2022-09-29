import Discord, { ApplicationCommandOptionType, ChatInputCommandInteraction, User } from 'discord.js';
import { ModeratedUser, UserSettings } from '../../database/User';

import { CommandFile } from '../../types';
import log from '../auto/log';

export = {
    command: {
        name: 'warn',
        description: 'All warn commands',
        options: [{
            name: 'add',
            description: 'Add a warn to a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'The user to warn',
                type: ApplicationCommandOptionType.User,
                required: true,
            }, {
                name: 'reason',
                description: 'The reason for warning the user',
                type: ApplicationCommandOptionType.String,
                required: true,
            }, {
                name: 'points',
                description: 'The amount of warn points per severity',
                type: ApplicationCommandOptionType.Number,
                required: true,
            }]
        }, {
            name: 'remove',
            description: 'Remove a warn from a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'The user to remove a warn from',
                type: ApplicationCommandOptionType.User,
                required: true,
            }, {
                name: 'id',
                description: 'The ID of the warn to remove',
                type: ApplicationCommandOptionType.String,
                required: true,
            }]
        }]
    },
    callback: async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getMember('user') as Discord.GuildMember;

        


        if(subcommand === 'add') {
            const reason = interaction.options.getString('reason') as string;
            const points = interaction.options.getNumber('points') as number;
            
            
            
            const res = await ModeratedUser.addWarn(interaction.user.id, reason, points, user.id)

            const warnEmbed = new Discord.EmbedBuilder()
            .setTitle(`You have been warned`)
            .setDescription(`You were warned by ${interaction.user.username} for \`${reason}.\`\n\n**We ask that you follow the rules to not get penalized or warned again.**`)
            .setColor('Red')
            .setTimestamp()
            .setAuthor({name: `Warned by: ${interaction.user.username} | Id: ${res?.id || 'None'}`, iconURL: interaction.guild.iconURL({forceStatic: false, size: 2048})});

            if(res) {

                await user.send({embeds: [warnEmbed]}).catch(() => {
                    console.log('Could not send warn embed to user');
                });

                warnEmbed.setDescription(`Warned ${user.user.username} for \`${reason}.\``)
                .setTitle(`Moderator ${interaction.user.username} has warned ${user.user.username}`)
                .setAuthor({name: `Warned by: ${interaction.user.username} | Id: ${res?.id || 'None'}`, iconURL: interaction.guild.iconURL({forceStatic: false, size: 2048})})

                interaction.reply({embeds: [warnEmbed]});
                log({embeds: [warnEmbed]});
            } else {
                interaction.reply({content: 'Failed to add warn', ephemeral: true});
            }
            
            
        } else {
            const id = interaction.options.getString('id') as string;
            const user = interaction.options.getMember('user') as Discord.GuildMember;

            const res = await ModeratedUser.removeWarn(user.id, id);

            if(res) {
                const warnEmbed = new Discord.EmbedBuilder()
                .setTitle(`Warn removed`)
                .setDescription(`Removed warn \`${id}\` from ${user.user.username}.`)
                .setColor('Red')
                .setTimestamp()
                .setAuthor({name: `Warn removed by: ${interaction.user.username}`, iconURL: interaction.guild.iconURL({forceStatic: false, size: 2048})});

                interaction.reply({embeds: [warnEmbed]});
                log({embeds: [warnEmbed]});
            } else {
                interaction.reply({content: 'Failed to remove warn', ephemeral: true});
            }
        }
    }
} as CommandFile.FileOptions;