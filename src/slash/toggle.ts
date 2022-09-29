import Discord, { CommandInteraction, ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { CommandFile } from '../types';
import toggleWelcome from './toggleCommands/toggleWelcome';
import toggleGoodbye from './toggleCommands/toggleGoodbye';
import toggleLogs from './toggleCommands/toggleLogs';
import log from './auto/log';

export = {
    command: {
        name: 'toggle',
        description: 'Toggle command for slash commands',
        options: [{
            name: 'welcome',
            description: 'Toggle the welcome channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'wtoggle',
                description: 'Toggle the welcome event',
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }]
        }, {
            name: 'goodbye',
            description: 'Toggle the goodbye channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'gtoggle',
                description: 'Toggle the goodbye event',
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }]
        }, {
            name: 'logs',
            description: 'Toggle the logs channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'ltoggle',
                description: 'Toggle the logs event',
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }]
        }]
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: ChatInputCommandInteraction) => {
        
        const { options } = interaction;
        const welcome = options.getBoolean('wtoggle');
        const goodbye = options.getBoolean('gtoggle');
        const logs = options.getBoolean('ltoggle');
        const subCommand = options.getSubcommand();

        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({name: `Set: ${subCommand}`})
        .setTitle(`A user (${interaction.user.username}) has used the set command`)
        .setColor('Random')
        .setFooter({text: 'Toggle command', iconURL: interaction.user.avatarURL()})
        .setTimestamp();

        const responseEmbed = new Discord.EmbedBuilder()
        .setTitle(`Set: ${subCommand}`)
        .setColor('Random')
        .setFooter({text: 'Toggle command', iconURL: interaction.user.avatarURL()})
        .setTimestamp();

        

        if (subCommand === 'welcome') {
            const { data, error } = await toggleWelcome.func({ guildId: interaction.guildId, toggle: welcome });

            
            if (error) {
                interaction.editReply(error);
                
                return
            }


            if (data) {
                const { toggle } = data;
                
                responseEmbed.setDescription(`Welcome toggle has been set to ${toggle}`);
                logEmbed.setDescription(`Goodbye toggle has been set to ${toggle}`);

                
                interaction.editReply({ embeds: [responseEmbed] });
            }
        }

        if (subCommand === 'goodbye') {
            const { data, error } = await toggleGoodbye.func({ guildId: interaction.guildId, toggle: goodbye });

            if (error) {
                interaction.editReply(error);
                
                return
            }

            

            if (data) {
                const { toggle } = data;
                
                responseEmbed.setDescription(`Goodbye toggle has been set to ${toggle}`);
                logEmbed.setDescription(`Goodbye toggle has been set to ${toggle}`);

                
                interaction.editReply({ embeds: [responseEmbed] });
            }
        }

        if (subCommand === 'logs') {
            const { data, error } = await toggleLogs.func({ guildId: interaction.guildId, toggle: logs });

            if (error) {
                interaction.editReply(error);
                
                return
            }

            

            if (data) {
                const { toggle } = data;
                
                responseEmbed.setDescription(`Logs toggle has been set to ${toggle}`);
                logEmbed.setDescription(`Logs toggle has been set to ${toggle}`);

                
                interaction.editReply({ embeds: [responseEmbed] });
            }
        }

        log({ embeds: [logEmbed] });
    }
} as CommandFile.FileOptions;