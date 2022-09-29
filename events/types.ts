import Discord, { ApplicationCommandData, Awaitable, ChatInputApplicationCommandData, Client, ClientEvents, PermissionsString } from 'discord.js'

export namespace CommandFile {
    export interface EventOptions<T extends keyof ClientEvents = keyof ClientEvents> {
        name: T;
        callback: (...args: ClientEvents[T]) => Awaitable<void>;
    }
}
    // THIS IS MY OWN NAMESPACING, NOT FROM DISCORD.JS
    // Used to make the command options easier to read
    //If you want to create a new slash command, copy this:

    /*

    import Discord, { ButtonBuilder, hyperlink, SelectMenuInteraction } from 'discord.js';
    import { CommandFile } from '../types';

    export = {
        command: {
            name: 'name',
            description: 'description',
        },
        callback: (interaction: Discord.CommandInteraction) => {

        }
    } as CommandFile.FileOptions;

    */

    // If you want to create any buttons, menus, etc. copy this:

    /*

    import Discord, { ButtonBuilder, hyperlink, SelectMenuInteraction } from 'discord.js';
    import { CommandFile } from '../types';

    export = {
        name: 'name' 
        type: 'type', //[only takes in dropdown, button, modal]
    } as CommandFile.FileOptions;
    callback: (interaction: Discord.XInteraction) => {
            
    }

    */

    // FOR BUTTONS, MENUS, ETC. ONLY, the TYPES ARE:

    // ButtonInteraction | ModalSubmitInteraction (modals) | SelectMenuInteraction (dropdown)
    


export type OutputData<T> = {
    error?: string;
    data?: T;
}

export interface SetFileOptions<Props, Output> {
    name: string;
    func: ({}: Props) => OutputData<Output> | Promise<OutputData<Output>>;
} 