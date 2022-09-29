import Discord, { ApplicationCommandOptionType } from 'discord.js';
import VerificationSchema from '../../database/VerificationSchema';
import { CommandFile } from '../../types';
import log from '../auto/log';
import setVerification from '../setComands/setVerification';

export = {
    command: {
        name: 'verification',
        description: 'All verification commands',
        options: [{
            name: 'set',
            description: 'Set the verification configuration',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'channel',
                description: 'Set the verification channel',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }, {
                name: 'role',
                description: 'Set the verification role',
                type: ApplicationCommandOptionType.Role,
                required: true
            }, {
                name: 'message',
                description: 'Set the verification message',
                type: ApplicationCommandOptionType.String,
                required: false
            }]
        }, {
            name: 'view',
            description: 'View the verification configuration',
            type: ApplicationCommandOptionType.Subcommand
        }]
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: Discord.ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        const embed = new Discord.EmbedBuilder()
        .setTitle('Verification')
        .setColor('#00ff00')
        .setTimestamp()
        .setFooter({text: 'Verification command', iconURL: interaction.user.avatarURL()});
        
        if(subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');
            const message = interaction.options.getString('message', false) || undefined;
            if(!channel || !role) return;

            const data: any = {
                _id: interaction.guildId,
                verificationChannelId: channel.id,
                verificationRoleId: role.id,
            }

            if(message) data.verificationMessage = message;

            const res = await setVerification.func(data)

            if(res.error) {
                embed.setColor('#ff0000');
                embed.setDescription(res.error);
                interaction.editReply({ embeds: [embed] });

                return;
            }

            const verificationMessage = res.data.verificationMessage as String || 'No message set';

            

            embed.setDescription(`Verification configuration set\n\nChannel: ${channel}\nRole: ${role}\nMessage: ${verificationMessage}`);
            interaction.editReply({ embeds: [embed] });
            embed.setDescription(`User ${interaction.user.username} has set the verification configuration to:\n\n Channel: ${channel.name}\nRole: ${role.name}\n\`Message: ${verificationMessage}\``)
        } else if (subcommand === 'view') {
            const res = await VerificationSchema.findOne({ _id: interaction.guildId });

            if(!res) {
                embed.setColor('#ff0000');
                embed.setDescription(`No verification configuration found`);
                interaction.editReply({ embeds: [embed] });

                return;
            }

            embed.setDescription(`Verification configuration\n\nChannel: <#${res.verificationChannelId}>\nRole: <@&${res.verificationRoleId}>\n\`Message: ${res.verificationMessage}\nVerified ${res.verifiedCount} members\``);
            interaction.editReply({ embeds: [embed] });
            return
        }


        log({ embeds: [embed] });
    }
} as CommandFile.FileOptions;