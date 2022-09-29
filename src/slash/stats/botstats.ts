import Discord, { CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';
import readCmds from '../../readCmds';
import { version }  from '../../../package.json';

export = {
    command: {
        name: 'botstats',
        description: 'Shows the bot stats',
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: CommandInteraction) => {
        const commands = readCmds();
        const client = interaction.client;
        let cmds = 1;
        const owner = await client.users.fetch('571673609953738784');

        commands.forEach(command => {
            if(command.command?.name) cmds++;
        })

        const embed = new Discord.EmbedBuilder()
            .setTitle('Bot Stats')
            .setColor('Random')
            .addFields([
                {
                    name: 'Ping',
                    value: `${client.ws.ping}ms`,
                },
                {
                    name: 'Version',
                    value: `v${version}`,
                    inline: true,
                },
                {
                    name: 'Online since',
                    value: `${client.uptime}`,
                    inline: true,
                },
                {
                    name: 'Commands',
                    value: `\`${cmds}\``,
                },
                {
                    name: 'Created by:',
                    value: `${owner.tag}`,
                    inline: true,
                },
            ])
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

        interaction.editReply({ embeds: [embed] });
    }
} as CommandFile.FileOptions;