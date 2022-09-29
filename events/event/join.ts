import Discord, { GuildMember } from 'discord.js';
import { client } from '../..';
import { CommandFile } from '../types';
import WelcomeSchema from '../../src/database/WelcomeSchema';
import log from '../../src/slash/auto/log';



export = {
    name: 'guildMemberAdd',
    callback: async (member) => {
       const result = await WelcomeSchema.findOne({ guildId: member.guild.id });

       if(!result) {
        const error = new Discord.EmbedBuilder()
        .setTitle('Settings incomplete')
        .setDescription(`The setting for \`Welcome channel, welcome message, welcome toggle\` is incomplete. Please set it up using \`/set goodbye goodbyechannel\``)
        .setColor('Red')
        .setTimestamp();

        log({ embeds: [error] });
        return;
       };

       if(result?.toggle === false) return;

       const channel = member.guild.channels.cache.get(result?.welcomeChannelId || '123') as Discord.TextChannel;

       if(!channel) return;

       const embed = new Discord.EmbedBuilder()
       .setTitle(`Welcome, ${member.user.username}!`)
       .setDescription(result.welcomeMessage || 'Welcome to the server!')
       .setColor('Random')
       .setThumbnail(member.user.displayAvatarURL({ forceStatic: false }))
       .setTimestamp();
       

       channel.send({embeds: [embed]});

    }
} as CommandFile.EventOptions<'guildMemberAdd'>;