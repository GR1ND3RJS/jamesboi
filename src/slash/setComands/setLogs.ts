import { SetFileOptions} from '../../types';
import LogsSchema from '../../database/LogsSchema';

interface SProps {
    guildId: string;
    channelId?: string;
}

interface SOutput {
    logsChannelId?: string;
    _id?: string;
}

const setLogs: SetFileOptions<SProps, SOutput> = {
    name: "setlogs",
    func: async ({channelId, guildId}) => {
        try {
            const update: SOutput = {
                _id: guildId,
                logsChannelId: channelId
            }

            await LogsSchema.findOneAndUpdate({
                _id: guildId
            }, update, {
                upsert: true
            });

            return {
                data: update
            };
        } catch (err) {
            return {
                error: err.message,
            }
        }
    }
}

export = setLogs;