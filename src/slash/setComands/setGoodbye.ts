import { SetFileOptions} from '../../types';
import GoodbyeSchema from '../../database/GoodbyeSchema';

interface SProps {
    guildId: string;
    channelId?: string;
    message?: string;
}

interface SOutput {
    goodbyeChannelId?: string;
    goodbyeMessage?: string;
    _id?: string;
}

const setGoodbye: SetFileOptions<SProps, SOutput> = {
    name: "setwelcome",
    func: async ({channelId, message, guildId}) => {
        try {
            const update: SOutput = {
                _id: guildId
            }

            if( channelId ) {
                update.goodbyeChannelId = channelId;
            } else if ( message ) {
                update.goodbyeMessage = message;
            }

            console.log(update)

            await GoodbyeSchema.findOneAndUpdate({
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

export = setGoodbye;