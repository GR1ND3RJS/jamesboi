import Discord from 'discord.js';
import { client } from "../../..";
import VerificationSchema from "../../database/VerificationSchema";
import {server_id} from '../../../config.json';

function returnArray (arrays: string[][]) {
    return arrays[Math.floor(Math.random() * arrays.length)]
}

function returnEmoji (emojis: string[]) {
    return emojis[Math.floor(Math.random() * emojis.length)]
}

function returnNumberOfEmojis (num: number, emojis: string[], exclude: string) {
    let array: string[] = []

    while (array.length < num) {
        let emoji = returnEmoji(emojis)
        if (emoji !== exclude) {
            if(!array.includes(emoji)) {
                array.push(emoji)
            }
            
        }
    }
    
    return array
}

function createRandomVerificationConstraint() {

    
    // Create an array of emojis that are not people, flags, or numbers, locally
    const emojis = ['🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '🏵', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🎰', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈', '🛫', '🛬', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯',];

    // Create an array of emojis that are people, locally
    const people = ['👶', '👦', '👧', '👨', '👩', '👴', '👵', '👲', '👳', '👮', '👷', '💂', '🤶', '🎅', '👸', '🤴', '👰', '🤵', '👼', '🤰', '🤱', '🙇', '💁', '🙅', '🙆', '🙋', '🤦', '🕴', '💃', '🕺', '👯']

    // Create an array of emojis that are flags, locally
    const flags = ['🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇮🇨', '🇨🇻', '🇧🇶', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇨🇮', '🇭🇷']

    // create an object that will have the correct emoji with the key of "correct", and an array of emojis with the key of "options"
    const Constraint = {
        correct: '',
        wrong: []
    }

    

    // Create a function that will return a random emoji from the array of people

    const verificationOptionArray = returnArray([people, flags, emojis])

    Constraint.correct = returnEmoji(verificationOptionArray)
    Constraint.wrong = returnNumberOfEmojis(4, verificationOptionArray, Constraint.correct)

    console.log(Constraint);

    return Constraint
}
// Create a function that will randomize the items in an array
// This function will take in an array and return a new array with the items in a random order
// This function will not mutate the original array
function randomizeItemsInAnArray<T>(array: T[]): T[] {
    // Create a new array that will be returned
    const newArray = []

    // Create a copy of the array that will be mutated
    const arrayCopy = [...array]

    // Create a while loop that will run until the arrayCopy is empty
    while (arrayCopy.length > 0) {
        // Create a random index that will be used to splice the arrayCopy
        const randomIndex = Math.floor(Math.random() * arrayCopy.length)

        // Splice the arrayCopy and push the item into the newArray
        newArray.push(arrayCopy.splice(randomIndex, 1)[0])
    }

    // Return the newArray
    return newArray
}

function randomLabelText(): string {
    const labels: string[] = ["Pick me!", "I am correct!", "Ill give you a hint, I am correct!", "I am the incorrect emoji!", "Pick the guy next to me!", "Not me!", "Me!", "Hey, it's me!", "Come on, pick me!", "<-- This guy!", "Not the guy next to me!",
    "Its the top emoji!", "Its the bottom emoji!", "Look at me, I'm the one!"]

    return labels[Math.floor(Math.random() * labels.length)]
}

const updateVerification = async (response?: 'set' | 'delete') => {



    
    const guild = client.guilds.cache.get(server_id) as Discord.Guild;
    const verificationData = await VerificationSchema.findOne({_id: guild.id})


    if(!verificationData) return;

    

    const { verificationChannelId, verificationMessage, verificationRoleId, verifiedCount, verificationId, prevVerificationChannelId } = verificationData;
    
    const channel = guild.channels.cache.get(verificationChannelId) as Discord.TextChannel;
    const prevChannel = guild.channels.cache.get(prevVerificationChannelId) as Discord.TextChannel;
    const role = guild.roles.cache.get(verificationRoleId) as Discord.Role;


    if(prevChannel) {
        const prevMessage = await prevChannel.messages.fetch(verificationId)
        if(prevMessage) { 
            prevMessage.delete();
            await VerificationSchema.findOneAndUpdate({_id: guild.id}, {verificationId: '', prevVerificationChannelId: channel.id})
            if(response === 'delete') return;
        }
    }
    
    
    const Constraint = createRandomVerificationConstraint()

    const verificationText = `${verificationMessage ? verificationMessage : ''}\n\n **Note**:\n
    - You must pick the correct menu option to get into the server.\n
    - Picking the wrong one will result in you getting blocked from verifying again. This helps by retaining well-intentioned members (like you!) and letting them redo the verification if they mistakenly answered incorrectly.\n
    - If you are kicked from the server, you will be able to rejoin after 4 minutes.\n\n
    **Verification Requirements**:\n
    - Find the option that has matches the emoji: ${Constraint.correct}\n`
    
    const embed = new Discord.EmbedBuilder()
    .setTitle('Verification')
    .setAuthor({name: `Welcome to ${guild.name}`, iconURL: guild.iconURL()})
    .setDescription(verificationText)
    .setColor('#00ff00')
    .setTimestamp()
    .setFooter({text: `Proudly verified ${verifiedCount} members!`, iconURL: guild.iconURL()});

    

    const menu = new Discord.SelectMenuBuilder()
    .setCustomId('verification')
    .setPlaceholder('Select an option')
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(randomizeItemsInAnArray([
        {
            label: randomLabelText(),
            value: 'kick-1',
            emoji: Constraint.wrong[0],
        },
        {
            label: randomLabelText(),
            value: 'kick-2',
            emoji: Constraint.wrong[1],
        },
        {
            label: randomLabelText(),
            value: 'kick-3',
            emoji: Constraint.wrong[2],
        },
        {
            label: randomLabelText(),
            value: 'verify',
            emoji: Constraint.correct,
        },
        {
            label: randomLabelText(),
            value: 'kick-4',
            emoji: Constraint.wrong[3],
        },
    ]))




    const row = new Discord.ActionRowBuilder()
    .setComponents([menu]) as Discord.ActionRowBuilder<Discord.SelectMenuBuilder>



    const message = await channel.send({embeds: [embed], components: [row]})

    await VerificationSchema.findOneAndUpdate({_id: guild.id}, {verificationId: message.id});
}


export = updateVerification;