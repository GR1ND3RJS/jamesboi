import LogsSchema from '../../database/LogsSchema';
import { SetFileOptions} from '../../types';

interface TProps {
    guildId: string;
    toggle: boolean;
}

interface TOutput {
    toggle: boolean
}

const toggleLogs: SetFileOptions<TProps, TOutput> = {
    name: 'togglelogs',
    func: async ({guildId, toggle}) => {
        try {
            await LogsSchema.findOneAndUpdate({
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

export = toggleLogs;