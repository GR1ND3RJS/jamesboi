import Discord, { CommandInteraction, ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionOverwrites, PermissionFlagsBits } from 'discord.js';
import { CommandFile } from '../types';
import setWelcome from './setComands/setWelcome';
import log from './auto/log';
import setGoodbye from './setComands/setGoodbye';
import setLogs from './setComands/setLogs';
import MemberCountSchema from '../database/MemberCountSchema';
import setMemberCount from './setComands/memberCount';

export = {
    command: {
        name: 'set',
        description: 'Set command goodbye and welcome commands',
        options: [{
            name: 'welcome',
            description: 'Set the welcome channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'welcomechannel',
                description: 'Set the welcome channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'channel',
                    description: 'The channel to set as the welcome channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }]
            }, {
                name: 'welcomemessage',
                description: 'Set the welcome message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'message',
                    description: 'The message to set as the welcome message',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }]
            }]
        }, {
            name: 'goodbye',
            description: 'Set the goodbye channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'goodbyechannel',
                description: 'Set the goodbye channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'channel',
                    description: 'The channel to set as the goodbye channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }]
            }, {
                name: 'goodbyemessage',
                description: 'Set the goodbye message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'message',
                    description: 'The message to set as the goodbye message',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }]
            }]
        }, {
            name: 'logs',
            description: 'Set the logs command',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'logchannel',
                description: 'Set the log channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'channel',
                    description: 'The channel to set as the log channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }]
            }]

        }, {
            name: 'membercount',
            description: 'Set the membercount command',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'toggle',
                description: 'Toggle the event',
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }]
        }],
    },
    permissions: [],
    defer: true,
    ephemeral: true,
    callback: async (interaction: ChatInputCommandInteraction) => {
        
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({name: `Set: ${subcommandGroup}`})
        .setTitle(`A user (${interaction.user.username}) has used the set command`)
        .setColor('Random')
        .setFooter({text: 'Set command', iconURL: interaction.user.avatarURL()})
        .setTimestamp();

        const responseEmbed = new Discord.EmbedBuilder()
        .setTitle(`Set: ${subcommandGroup}`)
        .setColor('Random')
        .setFooter({text: 'Set command', iconURL: interaction.user.avatarURL()})
        .setTimestamp();

        const input: any = {
            guildId: interaction.guild.id,
                
        }

        if (subcommandGroup === 'welcome') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message') ;

            if(interaction.options.getSubcommand() === 'welcomechannel') {
                if(!channel) {
                    responseEmbed.setDescription('Please provide a channel');
                    interaction.editReply({embeds: [responseEmbed]});
                    return
                } else {
                    input.channelId = channel.id;
                    
                }
            } else {
                if(!message) {
                    responseEmbed.setDescription('Please provide a message');
                    interaction.editReply({embeds: [responseEmbed]});
                    return
                } else {
                    input.message = message;
                }
            }


            

            console.log(input)

            

            
            const { data, error } = await setWelcome.func(input)

            if(error) {
                responseEmbed
                .setDescription(`Something went wrong: ${error}`)
                .setColor('Red');

                interaction.editReply({embeds: [responseEmbed]});
                return
            }
            console.log(data)

            let text: string;

            if(data.welcomeChannelId) {
                text = `Welcome channel has been set to ${data.welcomeChannelId}`;
            } else if(data.welcomeMessage) {
                text = `Welcome message has been set to ${data.welcomeMessage}`;
            }
        
            responseEmbed.setDescription(`Successfully set ${data?.welcomeMessage ? 'the values' : 'a value'} for: \`\`\`${text}\`\`\``);
            logEmbed.setDescription(`**${interaction.user.username}** has set ${data?.welcomeMessage ? 'the values' : 'a value'} for: \`\`\`${text}\`\`\``);


            interaction.editReply({ embeds: [responseEmbed] });
        } else if(subcommandGroup === 'goodbye') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message') ;

            if(interaction.options.getSubcommand() === 'goodbyechannel') {
                if(!channel) {
                    responseEmbed.setDescription('Please provide a channel');
                    interaction.editReply({embeds: [responseEmbed]});
                    return
                } else {
                    input.channelId = channel.id;
                    
                }
            } else {
                if(!message) {
                    responseEmbed.setDescription('Please provide a message');
                    interaction.editReply({embeds: [responseEmbed]});
                    return
                } else {
                    input.message = message;
                }
            }
            
            const { data, error } = await setGoodbye.func(input)

            if(error) {
                responseEmbed
                .setDescription(`Something went wrong: ${error}`)
                .setColor('Red');

                interaction.editReply({embeds: [responseEmbed]});
                return
            }
            console.log(data)

            let text: string;

            if(data.goodbyeChannelId) {
                text = `Goodbye channel has been set to ${data.goodbyeChannelId}`;
            } else if(data.goodbyeMessage) {
                text = `Goodbye message has been set to ${data.goodbyeMessage}`;
            }
        
            responseEmbed.setDescription(`Successfully set ${data?.goodbyeMessage ? 'the values' : 'a value'} for: \`\`\`${text}\`\`\``);
            logEmbed.setDescription(`**${interaction.user.username}** has set ${data?.goodbyeMessage ? 'the values' : 'a value'} for: \`\`\`${text}\`\`\``);


            interaction.editReply({ embeds: [responseEmbed] });
        } else if (subcommandGroup === 'logs') {

            const channel = interaction.options.getChannel('channel');

            if(!channel) {
                responseEmbed.setDescription('Please provide a channel');
                interaction.editReply({embeds: [responseEmbed]});
                return
            } else {
                input.channelId = channel.id;
                
            }
            
            const { data, error } = await setLogs.func(input)

            if(error) {
                responseEmbed
                .setDescription(`Something went wrong: ${error}`)
                .setColor('Red');

                interaction.editReply({embeds: [responseEmbed]});
                return
            }
            console.log(data)

            let text: string;

            if(data.logsChannelId) {
                text = `Log channel has been set to ${data.logsChannelId}`;
            }
        
            responseEmbed.setDescription(`Successfully set the value for: \`\`\`${text}\`\`\``);
            logEmbed.setDescription(`**${interaction.user.username}** has set the value for: \`\`\`${text}\`\`\``);
            interaction.editReply({ embeds: [responseEmbed] });
        } else if(subcommand === 'membercount') {
            const isChannel = interaction.guild.channels.cache.find(c => c.name.includes('📊Members-'))

            isChannel.delete()

            const memberChannel = await interaction.guild.channels.create({
                name: `📊Members-${interaction.guild.memberCount}`,
                type: Discord.ChannelType.GuildText,
                permissionOverwrites: [{
                    id: interaction.guild.id,
                    deny: ["SendMessages", "ReadMessageHistory"],
                }]
            });

            const { data, error } = await setMemberCount.func({
                guildId: interaction.guild.id,
                channelId: memberChannel.id
            })

            if(error) {
                responseEmbed
                .setDescription(`Something went wrong: ${error}`)
                .setColor('Red');

                interaction.editReply({embeds: [responseEmbed]});
                return
            }

            responseEmbed.setDescription(`Successfully set the value for: \`\`\`Member count channel has been set to ${data.channelId}\`\`\``);

            interaction.editReply({ embeds: [responseEmbed] });
            
        }


        log({ embeds: [logEmbed] });
    }
} as CommandFile.FileOptions;