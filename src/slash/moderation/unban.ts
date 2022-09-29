import Discord, { ActionRowBuilder, APIActionRowComponent, APITextInputComponent, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, ModalBuilder, SelectMenuBuilder, SelectMenuComponentOptionData, TextInputBuilder, TextInputComponent, TextInputStyle, User } from 'discord.js';
import { CommandFile } from '../../types';
import log from '../auto/log';


const splitN = 12 // How many users are viewed per page

export = {
    command: {
        name: 'unban',
        description: 'Unbans a user',
    },
    callback: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply({content: 'Loading banned users...'});

        const bans = await interaction.guild.bans.fetch();

        bans.sort((a, b) => b.user.createdTimestamp - a.user.createdTimestamp);

        const users: User[] = [];

        bans.forEach(ban => {
            users.push(ban.user);
        })

        

        const usersPages = []
        let u = []

        users.forEach((user, i) =>  {

            if(i % splitN === 0 && i !== 0) {
                usersPages.push(u);
                u = [];
                u.push(`#${i + 1} - ${user.tag} \`${user.id}\``);
                return;
            }

            u.push(`#${i + 1} - ${user.tag} \`${user.id}\``);  // Second attempt at splitting items into multiple arrays
        })

        // for (let i = 0; i <= users.length; i++) { //First attempt at splitting items into multiple arrays
        //     if(u.length % splitN === 0 && u.length !== 0) {
        //         usersPages.push(u);
        //         u = [];
        //         console.log(users[i])
        //         if(users[i] !== undefined) {
        //             u.push(`#${i + 1} ${users[i].tag} \`${users[i].id}\``)
        //         }
                
        //         break;
        //     } // get the last items
        //     else {
                
        //         if(users[i] !== undefined) {
        //             u.push(`#${i + 1} ${users[i].tag} \`${users[i].id}\``)
        //         }
        //         console.log(u)
        //     }

        // }

        // check if usersPages has the last items
        if(u.length > 0) {
            usersPages.push(u);
        }
        // `#${i} ${user.tag} \`${user.id}\``
        //`#${(index - 1) + i} - **${users[(index - 1) + i]?.tag}** \`${users[(index - 1) + i]?.id}\``


        console.log(usersPages);
        
        let index = 1;
        let page = 1;

        const embed = new Discord.EmbedBuilder()
        .setTitle('Banned users')
        .setColor('Random')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })})
        .setDescription(`**${users.length}** banned users.\n\n**How to use** \n- Find a page which includes the user you want to unban.
        \n- Click on the menu and select their username\n- Add a reason if needed.\n- Click submit on the modal to unban.`)
        .setFooter({ text: `Page: Introduction`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

        const rightButton = new ButtonBuilder()
            .setCustomId('right')
            .setLabel('Right')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('➡️');

            const leftButton = new ButtonBuilder()
            .setCustomId('left')
            .setLabel('Left')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⬅️')
            .setDisabled(true);

            

            const menu = new SelectMenuBuilder()
            .setCustomId('unban-menu')
            .setPlaceholder('Select a user to unban')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions([{
                label: 'Loading...',
                value: 'loading',
            }]);

            const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);
            
            

            

        interaction.editReply({ embeds: [embed], components: [{type: 1, components: [acceptButton]}] }).then(async (msg) => {
            selectMenuOptions(usersPages[index - 1], menu);

            const filter = (i: Discord.Interaction) => i.user.id === interaction.user.id;

            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i: Discord.Interaction) => {
                // button interaction
                if(i.isButton()) {
                    if(i.customId === 'right') {
                        leftButton.setDisabled(false);
                        if(index === usersPages.length - 1) {
                            index = usersPages.length - 1;
                            page = usersPages.length;
                        }
                        else {
                            index++;
                            page++;

                            if(page === usersPages.length) {
                                rightButton.setDisabled(true)
                            }
                        }
                    }
                    else if(i.customId === 'left') {
                        rightButton.setDisabled(false);
                        if(index === 0) {
                            index = 0;
                            page = 1;
                        }
                        else {
                            index--;
                            page--;

                            if(page === 1) {
                                leftButton.setDisabled(true)
                            }
                        }
                    } else if(i.customId === 'accept') {
                        leftButton.setDisabled(true);
                        if(index === usersPages.length - 1) {
                            index = 0;
                            page = 1;
                        }
                        else {
                            index = 0;
                            page = 1;

                            if(page === usersPages.length) {
                                rightButton.setDisabled(true)
                            }

                            if(usersPages.length === 1) {
                                rightButton.setDisabled(true)
                                leftButton.setDisabled(true)
                            }
                        }
                    }

                    embed.setDescription(usersPages[index].join('\n'));
                    embed.setFooter({ text: `Page: ${page} of ${usersPages.length}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});

                    selectMenuOptions(usersPages[index], menu);

                    await i.update({ embeds: [embed], components: [{type: 1, components: [menu]}, {type: 1, components: [leftButton, rightButton]}] });
                }

                // select menu interaction
                if(i.isSelectMenu()) {
                    const values = i.values;

                    const reasonInput = new TextInputBuilder()
                    .setCustomId('reason-input')
                    .setPlaceholder('Reason')
                    .setMinLength(0)
                    .setMaxLength(100)
                    .setLabel('Reason')
                    .setStyle(TextInputStyle.Short);

                    const row = new ActionRowBuilder()
                    .setComponents([reasonInput]).toJSON() as APIActionRowComponent<APITextInputComponent>;

                    const modal = new ModalBuilder()
                    .setTitle('Unban user')
                    .setCustomId('unban-modal')
                    .addComponents([row]);

                    
                    
                    await i.showModal(modal);
                    await i.awaitModalSubmit({
                        time: 60000,
                        filter: (i: Discord.ModalSubmitInteraction) => i.customId === 'unban-modal',
                    }).then(async (modalInteraction) => {
                        const input = modalInteraction.components[0].components[0] as TextInputComponent;

                        const reason = input.value || 'No reason provided';
                        

                        const user = await interaction.guild.bans.fetch(values[0]);

                        await interaction.guild.bans.remove(user.user.id, reason);
                        embed.setTitle(`Unbanned ${user.user.tag}`);
                        embed.setDescription(`Unbanned ${user.user.tag} \`${user.user.id}\``);
                        embed.setColor('Green')
                        embed.setFooter({ text: `Done`, iconURL: interaction.user.displayAvatarURL({ forceStatic: false })});
                        await modalInteraction.deferUpdate();

                        
                        await msg.edit({ embeds: [embed], components: [] });
                        collector.stop(`${user.user.tag} | ${reason}`);
                        
                    })

                }

            })

            collector.on('end', async (i, userR) => {
                embed.setDescription(`${interaction.user.username} has unbanned ${userR.split(' |')[0] || 'a user'} for \`${userR.split('| ')[1] || 'No reason provided'}\``);
                log({embeds: [embed]});
            })
        });

    }
} as CommandFile.FileOptions;


function selectMenuOptions(users: string[], menu: SelectMenuBuilder) {
    const data = users.map(user => {
        const id = user.split('`')[1].split('`')[0];
        const tag = user.split('- ')[1].split(' `')[0];
        const username = user.split('- ')[1].split(' `')[0].split('#')[0];   
        const num = user.split(' ')[0].split('#')[1];

        return<SelectMenuComponentOptionData> {
            label: `${num} - ${tag}`,
            value: id,
            description: `Unban ${username}`,
        }
    })

    

    menu.setOptions(data);
}