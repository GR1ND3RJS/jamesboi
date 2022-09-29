import WelcomeSchema from '../../database/WelcomeSchema';
import { SetFileOptions} from '../../types';

interface TProps {
    guildId: string;
    toggle: boolean;
}

interface TOutput {
    toggle: boolean
}

const toggleWelcome: SetFileOptions<TProps, TOutput> = {
    name: 'togglewelcome',
    func: async ({guildId, toggle}) => {
        try {
            await WelcomeSchema.findOneAndUpdate({
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

export = toggleWelcome;