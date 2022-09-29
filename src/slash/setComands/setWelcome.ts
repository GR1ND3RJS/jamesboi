import { SetFileOptions} from '../../types';
import WelcomeSchema from '../../database/WelcomeSchema';

interface SProps {
    guildId: string;
    channelId?: string;
    message?: string;
}

interface SOutput {
    welcomeChannelId?: string;
    welcomeMessage?: string;
    _id?: string;
}

const setWelcome: SetFileOptions<SProps, SOutput> = {
    name: "setwelcome",
    func: async ({channelId, message, guildId}) => {
        try {
            const update: SOutput = {
                _id: guildId
            }

            if( channelId ) {
                update.welcomeChannelId = channelId;
            } else if ( message ) {
                update.welcomeMessage = message;
            }

            console.log(update)

            await WelcomeSchema.findOneAndUpdate({
                _id: guildId
            }, update, {
                upsert: true
            });

            console.log(update)
            return {
                data: update
            };
        } catch (err) {
            return {
                error: err.message,
            }
        }

        return {
            error: 'Something went wrong'
        }
    }
}

export = setWelcome;