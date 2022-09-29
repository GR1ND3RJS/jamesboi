import Discord, {
  ActionRowBuilder,
  APIActionRowComponent,
  APITextInputComponent,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
  TextInputBuilder,
  TextInputComponent,
  TextInputStyle,
} from "discord.js";
import { ModeratedUser, UserSettings } from "../../database/User";
import { CommandFile } from "../../types";
import log from "../auto/log";

const wRun = 12;

export = {
  command: {
    name: "warnings",
    description: "Shows the warnings of a user",
    options: [
      {
        name: "user",
        description: "The user to show the warnings of",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "id",
        description: "The ID of the warning to show",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  defer: true,
  ephemeral: true,
  callback: async (interaction: Discord.ChatInputCommandInteraction) => {
    const user = interaction.options.getMember("user") as Discord.GuildMember;
    const id = interaction.options.getString("id") as string;

    const warnings = await ModeratedUser.searchUser(user.id);

    if (warnings) {
      const { bans, kicks, warns, id: warningId, appeals } = warnings;

      if (id) {
        const warning = warns.find((warn) => warn.id === id);

        if (warning) {
          const embed = new Discord.EmbedBuilder()
            .setTitle(`Warning id: ${warningId}`)
            .setColor("Random")
            .addFields([
              {
                name: "Reason",
                value: warning.reason,
              },
              {
                name: "Points",
                value: `${warning.points}`,
              },
              {
                name: "Moderator",
                value: warning.moderatorId,
              },
              {
                name: "Time",
                value: `<t:${Math.floor(
                  new Date().getTime() - warning.timestamp / 1000
                )}:R>`,
              },
            ])
            .setTimestamp()
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({
                forceStatic: false,
              }),
            });

          interaction.editReply({ embeds: [embed] });
        } else {
          interaction.editReply({
            content: "That warning doesn't exist",
          });
        }
      } else {
        const warnPages = [];
        let w = [];


        if(!warns[0]) {
          return interaction.editReply({ content: "This user has no warnings" });
        }

        warns.forEach((warn, i) => {
          const textTemplate = `\`\`\`ID: ${warn.id}\nReason: ${
            warn.reason
          }\nPoints: ${warn.points}\nModerator: ${
            warn.moderatorId
          }\nTime: <t:${Math.floor(
            new Date().getTime() - warn.timestamp / 1000
          )}:R>\`\`\``;

          if (i % wRun === 0 && i !== 0) {
            warnPages.push(w);
            w = [];
            w.push(textTemplate);
            return;
          }

          w.push(textTemplate);
        });

        if (w.length > 0) {
          warnPages.push(w);
        }

        console.log(warnPages);

        let index = 1;
        let page = 1;

        const embed = new Discord.EmbedBuilder()
          .setTitle("ALL WARNINGS")
          .setColor("Purple")
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({
              forceStatic: false,
            }),
          })
          .setDescription(
            `**${warns.length}** warns.\n\n**How to use** \n- You can view a list of warnings from this user using the buttons below.\n- You have the ability to remove, or modify the selected warning.`
          )
          .setFooter({
            text: `Page: Introduction`,
            iconURL: interaction.user.displayAvatarURL({
              forceStatic: false,
            }),
          });

        const rightButton = new ButtonBuilder()
          .setCustomId("right")
          .setLabel("Right")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("➡️");

        const leftButton = new ButtonBuilder()
          .setCustomId("left")
          .setLabel("Left")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⬅️")
          .setDisabled(true);

        

        const acceptButton = new ButtonBuilder()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success);

        interaction
          .editReply({
            embeds: [embed],
            components: [{ type: 1, components: [acceptButton] }],
          })
          .then((msg) => {

            const filter = (i: Discord.Interaction) =>
              i.user.id === interaction.user.id;

            const collector = msg.createMessageComponentCollector({
              filter,
              time: 60000,
            });

            collector.on("collect", async (i: Discord.Interaction) => {
              // button interaction
              if (i.isButton()) {
                if (i.customId === "right") {
                  leftButton.setDisabled(false);
                  if (index === warnPages.length - 1) {
                    index = warnPages.length - 1;
                    page = warnPages.length;
                  } else {
                    index++;
                    page++;

                    if (page === warnPages.length) {
                      rightButton.setDisabled(true);
                    }
                  }
                } else if (i.customId === "left") {
                  rightButton.setDisabled(false);
                  if (index === 0) {
                    index = 0;
                    page = 1;
                  } else {
                    index--;
                    page--;

                    if (page === 1) {
                      leftButton.setDisabled(true);
                    }
                  }
                } else if (i.customId === "accept") {
                  leftButton.setDisabled(true);
                  if (index === warnPages.length - 1) {
                    index = 0;
                    page = 1;
                  } else {
                    index = 0;
                    page = 1;

                    if (page === warnPages.length) {
                      rightButton.setDisabled(true);
                    }

                    if (warnPages.length === 1) {
                      rightButton.setDisabled(true);
                      leftButton.setDisabled(true);
                    }
                  }
                }

                console.info(`index: ${index} | page: ${page} | data: ${warnPages[index]}`);
                embed.setDescription(warnPages[index].join("\n"));
                embed.setFooter({
                  text: `Page: ${page} of ${warnPages.length}`,
                  iconURL: interaction.user.displayAvatarURL({
                    forceStatic: false,
                  }),
                });

                

                await i.update({
                  embeds: [embed],
                  components: [
                    { type: 1, components: [leftButton, rightButton] },
                  ],
                });
              }

              // select menu interaction
            });

            collector.on("end", async (i, userR) => {
              embed.setDescription(
                `${interaction.user.username} has unbanned ${
                  userR.split(" |")[0] || "a user"
                } for \`${userR.split("| ")[1] || "No reason provided"}\``
              );
              log({ embeds: [embed] });
            });
          });
      }
    }
  },
} as CommandFile.FileOptions;




