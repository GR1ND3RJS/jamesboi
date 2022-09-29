import GoodbyeSchema from '../../database/GoodbyeSchema';
import { SetFileOptions} from '../../types';

interface TProps {
    guildId: string;
    toggle: boolean;
}

interface TOutput {
    toggle: boolean
}

const toggleGoodbye: SetFileOptions<TProps, TOutput> = {
    name: 'togglegoodbye',
    func: async ({guildId, toggle}) => {
        try {
            await GoodbyeSchema.findOneAndUpdate({
                _id: guildId
            }, {
                _id: guildId,
                toggle
            }, {
                upsert: true
            });

            return {
                data: {
                    toggle
                }
            }
        } catch (err) {
            return {
                error: err.message
            }
        }

    }
}

export = toggleGoodbye;