import Discord from 'discord.js';
import VerificationSchema from '../database/VerificationSchema';
import { CommandFile } from '../types';
import { ModeratedUser } from '../database/User';


function checkIfTimeoutIsOver(timeout: number) {
    return timeout < Date.now();
}

function getTimeUntilTimeout(timeout: number) {
    return Math.floor(timeout - Date.now());
}

function getUnixTime(time: number = 0) {
    return Math.floor(time / 1000);
}

export = {
    name: 'verification',
    type: 'dropdown',
    defer: true,
    ephemeral: true,
    callback: async (interaction: Discord.SelectMenuInteraction) => {
        const value = interaction.values[0];

        const embed = new Discord.EmbedBuilder()
        .setTitle('Verification Complete')
        .setColor('#00ff00')
        .setTimestamp();

        const userData = await ModeratedUser.searchUser(interaction.user.id);

        if(!userData.verificationStatus.canVerify && checkIfTimeoutIsOver(userData.verificationStatus.timeout)) {
            await ModeratedUser.untimeoutUser(interaction.user.id);
        } else {
            if(!userData.verificationStatus.canVerify) {
                const timeUntilTimeout = getUnixTime(new Date().getTime() + getTimeUntilTimeout(userData.verificationStatus.timeout));
                embed.setTitle('On Timeout')
                .setColor('#ff0000')
                .setDescription(`You are currently on timeout, please try again later. You can try again <t:${timeUntilTimeout}:R>`);

                return interaction.editReply({ embeds: [embed] });
            }
            
        }


        

        if(value === 'verify') {
            const res = await VerificationSchema.findOne({ _id: interaction.guildId });
            if(!res) return interaction.editReply({ embeds: [embed.setDescription('Verification result: Error\n\nFailed to fetch roleId from database')] });
            const role = interaction.guild.roles.cache.get(res.verificationRoleId);
            if(!role) return interaction.editReply({ embeds: [embed.setDescription('Verification result: Error\n\nRole is does not exist in server.')] });


            embed.setDescription(`Verification result: Success\nYou will be given the \`${role.name}\` role shortly. Welcome to the server!`);

            interaction.editReply({ embeds: [embed] });

            setTimeout(() => {
               const member = interaction.member as Discord.GuildMember;

               member.roles.add(role.id);

            }, 5000);
        } else {


            const timestamp = await ModeratedUser.timeoutUser(interaction.user.id, 4);

            const ms = 4 * 60 * 1000

            const timeUntilTimeout = getUnixTime(new Date().getTime() + ms);

            embed.setDescription(`Verification result: Failed\n\nYou have failed the verification process. You are blocked from verifying again for some time. You will be able to try again <t:${timeUntilTimeout}:R>`);
            
            interaction.editReply({ embeds: [embed] });
        }
    }
} as CommandFile.FileOptions;