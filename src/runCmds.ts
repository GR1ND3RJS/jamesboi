import Discord, { ApplicationCommandOptionType, ApplicationCommandType, CacheType, PermissionsString } from "discord.js";
import { CommandFile } from "./types";
import { image_data } from '../config.json';


interface PermissionOutput {
    allowed: boolean;
    missing?: PermissionsString[];
}

function checkForPermissions(interaction: Discord.CommandInteraction<CacheType> | Discord.SelectMenuInteraction<CacheType> | Discord.ButtonInteraction<CacheType> | Discord.ModalSubmitInteraction<CacheType>, permissions: PermissionsString[] = []): PermissionOutput {
    const data: PermissionOutput = {
        allowed: true,
        missing: [],
    }

    if(!permissions[0]) {
      return data;
    }

    for(const permission of permissions) {
        if (!interaction.memberPermissions.has(permission)) {
            data.allowed = false;
            data.missing.push(permission);
        }
    }
    return data;
}

export default async function runCmds(
  client: Discord.Client,
  intOptions: CommandFile.FileOptions
) {
  let { name, type = 'slash', callback, command, permissions = [], defer, ephemeral = true } = intOptions;
  

  if(command?.name) {
    let text = `Loaded command ${command?.name}`
    
    // if(command?.options[0]) {
      
    //   command?.options?.forEach(option => {
    //     if(option?.type === ApplicationCommandOptionType.SubcommandGroup) {
    //       text += `with subcommand group: *${option?.name}* having subcommands:\n`
    //       option?.options?.forEach((subcommand, i) => {
    //         let t = ''
    //         for(let j = 0; j < i; j++) {
    //           t += '| '
    //         }
    //         text += `${t}| ${subcommand?.name}\n`
    //       })
    //       text += '\n'
    //     }
    //   })
    // }

    console.log(text)
    name = command.name;
    type = 'slash';
  }

  if(!name) console.warn(`A command seems to be missing a name.`);

  client.on("interactionCreate", async (interaction) => {
   
    if(interaction.isAutocomplete()) {
      return
    };


    const perms = checkForPermissions(interaction, permissions);

    if(perms.allowed === false) {

      console.log(perms.missing.join('\n'))

      let text = perms.missing.map(perm => `{${perm}} Permission\n`).join('')

      const embed = new Discord.EmbedBuilder()
      .setTitle(`Error: Missing Permissions`)
      .setDescription(`You are not able to use this command. You are missing the following permissions: \`\`\`${text || 'No permissions available'}\`\`\`\n\nIf you believe this is a mistake, please contact a member of the staff team.`)
      .setColor('#ff0000')
      .setTimestamp()
      .setFooter({ text:`Missing Permissions` })
      .setThumbnail(image_data.error);



        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })

        return
    }


    
    


    if (interaction.isChatInputCommand()) {
      
      if(interaction.commandName.toLowerCase() === command?.name.toLowerCase()) {
        
        if (type === "slash") {
          if(defer) {
            await interaction.deferReply({ ephemeral });
          }
          callback(interaction);
        }
      }

      return
    }



    // if (interaction.isCommand()) {
    //   if (interaction.commandName.toLowerCase() === command?.name.toLowerCase()) {
    //     if (type === "slash") {
    //       callback(interaction);
    //     }
    //   }

    //   return
    // }

    if (interaction.isButton()) {
      if (interaction.customId.toLowerCase() === name?.toLowerCase() || interaction.customId.toLowerCase().includes(`${name.toLowerCase()}-`)) {
        if (type === "button") {
          if(defer) {
            await interaction.deferReply({ ephemeral });
          }
          callback(interaction);
        }
      }

      return
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.toLowerCase() === name?.toLowerCase() || interaction.customId.toLowerCase().includes(`${name.toLowerCase()}-`)) {
        if (type === "modal") {
          if(defer) {
            await interaction.deferReply({ ephemeral });
          }
          callback(interaction);
        }
      }

      return
    }

    if(interaction.isSelectMenu()) {
      if(interaction.customId.toLowerCase() === name?.toLowerCase() || interaction.customId.toLowerCase().includes(`${name.toLowerCase()}-`)) {
        if(type === "dropdown") {
          if(defer) {
            await interaction.deferReply({ ephemeral });
          }
          callback(interaction);
        }
      }

      return
    }
  });
}
