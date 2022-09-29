import Discord, { CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types';

export = {
    command: {
        name: 'invites',
        description: 'View all invites in the server',
    },
    defer: true,
    ephemeral: true,
    callback: async (interaction: CommandInteraction) => {
        const server = interaction.guild;
        
        const inviteData = await server.invites.fetch();

        inviteData.sort((a, b) => b.uses - a.uses);



        let invites = inviteData.map(invite => {

            if(invite.uses > 0 && invite !== undefined) {


                if(invite.inviter.username === interaction.user.username) {
                    return<Discord.EmbedField> {
                        name: `Your invites:`,
                        value: `\`${invite.uses} uses (code: ${invite.code})\``,
                        inline: false
                    }
                }

                return<Discord.EmbedField> {
                    name: `${invite.inviter.username}#${invite.inviter.discriminator}'s invites:`,
                    value: `\`${invite.uses} uses (code: ${invite.code})\``,
                    inline: false
                };
            }
        })
        
        invites.push({name: 'Total', value: `\`${inviteData.reduce((a, b) => a + b.uses, 0)}\``, inline: false})

        //remove any undefined values
        invites = invites.filter(invite => invite !== undefined);

        

        console.log(invites)
        const embed = new Discord.EmbedBuilder()
            .setTitle('All invites')
            .setColor('Random')
            .addFields(invites)
            .setTimestamp()
            .setThumbnail(server.iconURL({ forceStatic: false }))
            .setFooter({ text: `Requested by ${interaction.user.tag} (Sorted most invites to least)`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

        interaction.editReply({ embeds: [embed] });
    }
} as CommandFile.FileOptions;