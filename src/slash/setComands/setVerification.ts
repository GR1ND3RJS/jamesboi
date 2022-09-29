import VerificationSchema from "../../database/VerificationSchema";
import { SetFileOptions} from '../../types';
import updateVerification from "../auto/updateVerification";

interface VProps {
    _id: string;
    verificationChannelId: string;
    verificationRoleId: string;
    verificationMessage?: string;
}

interface VOutput {
    verificationChannelId?: string;
    verificationRoleId: string;
    verificationMessage: string;
    verifiedCount: number;
}

const setVerification: SetFileOptions<VProps, VOutput> = {
    name: "setverification",
    func: async ({_id, verificationChannelId, verificationMessage, verificationRoleId}) => {
        try {
            let update: VOutput | any = {
                verificationChannelId,
                verificationRoleId,
            }

            if(verificationMessage) {update.verificationMessage = verificationMessage};

            const prev = await VerificationSchema.findOne({_id})

            if(prev?.verificationChannelId) {
                update.prevVerificationChannelId = prev.verificationChannelId
            }

            await VerificationSchema.findOneAndUpdate({
                _id
            }, update, {
                upsert: true
            });

            const res = await VerificationSchema.findOne({_id})

            const data: VOutput = {
                verificationChannelId: res.verificationChannelId,
                verificationRoleId: res.verificationRoleId,
                verificationMessage: res.verificationMessage,
                verifiedCount: res.verifiedCount
            }

            await updateVerification('set')

            
            
            return {
                data
            };
        } catch (err) {
            console.log(err)
            return {
                error: err.message,
            }
        }
    }
}

export = setVerification;
