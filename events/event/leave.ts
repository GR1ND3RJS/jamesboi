import Discord, { GuildMember } from 'discord.js';
import { client } from '../..';
import { CommandFile } from '../types';
import GoodbyeSchema from '../../src/database/GoodbyeSchema';
import log from '../../src/slash/auto/log';



export = {
    name: 'guildMemberRemove',
    callback: async (member) => {
       const result = await GoodbyeSchema.findOne({ guildId: member.guild.id });

       if(!result) {
        const error = new Discord.EmbedBuilder()
        .setTitle('Settings incomplete')
        .setDescription(`The setting for \`Goodbye channel, goodbye message, goodbye toggle\` is incomplete. Please set it up using \`/set goodbye goodbyechannel\``)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [error] });
        return;
       };

       if(result?.toggle === false) return;

       const channel = member.guild.channels.cache.get(result?.goodbyeChannelId || '123') as Discord.TextChannel;

       if(!channel) return;

       const embed = new Discord.EmbedBuilder()
       .setTitle(`${member.user.username} has left.`)
       .setDescription(result.goodbyeMessage || 'They have left the server! Hope they come back!')
       .setColor('Random')
       .setThumbnail(member.user.displayAvatarURL({ forceStatic: false }))
       .setTimestamp();

       channel.send({embeds: [embed]});

    }
} as CommandFile.EventOptions<'guildMemberRemove'>;