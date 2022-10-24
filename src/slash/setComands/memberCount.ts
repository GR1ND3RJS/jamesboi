import { SetFileOptions} from '../../types';
import MemberCountSchema from '../../database/MemberCountSchema';

interface SProps {
    guildId: string;
    channelId: string;
}

interface SOutput {
    guildId: string;
    channelId: string;
}

const setMemberCount: SetFileOptions<SProps, SOutput> = {
    name: "setMemberCount",
    func: async ({channelId, guildId}) => {

        try {
            const result = await MemberCountSchema.findOneAndUpdate({
                _id: guildId,
            }, {
                _id: guildId,
                mChannelId: channelId,
            }, {
                upsert: true,
                new: true,
            });

            return {
                data: {
                    guildId: result._id,
                    channelId: result.mChannelId,
                }
            };

        } catch (e) {

            return {
                error: e.message
            }
        }
    } 
    
}

export = setMemberCount;