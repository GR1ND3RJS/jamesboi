import { User } from 'discord.js';
import WarnSchema from './WarnSchema';

export interface UserSettings {
    _id: string;
    warns: {
        moderatorId: string;
        reason: string;
        timestamp: number;
        id: string;
        points: number;
    }[];
    appeals: {
        message: string;
        timestamp: number;
        accepted: boolean;
    }[];
    bans: number;
    kicks: number;
    timeouts: number;
}

export class ModeratedUser implements UserSettings {
    _id: string;
    warns: any[];
    appeals: any[];
    bans: number;
    kicks: number;
    timeouts: number;

    constructor({ _id, warns = [], appeals = [], bans = 0, kicks = 0, timeouts = 0 }: UserSettings) {
        this._id = _id;
        this.warns = warns;
        this.appeals = appeals;
        this.bans = bans;
        this.kicks = kicks;
        this.timeouts = timeouts;
    }

    public static createId() {
        return Math.random().toString(36).substring(2, 9);
    }

    public static async addWarn(moderatorId: string, reason: string, points: number, userId: string) {
        await this.searchUser(userId);

        const warn: UserSettings['warns'][0] = {
            moderatorId,
            reason,
            timestamp: Date.now(),
            id: this.createId(),
            points,
        };

        await WarnSchema.findOneAndUpdate({ _id: userId }, { $push: { warns: warn } }, { upsert: true });

        return warn;
    }

    public static async removeWarn(userId: string, warnId: string) {
        await this.searchUser(userId);
        const res = await WarnSchema.findOneAndUpdate({ _id: userId }, { $pull: { warns: { id: warnId } } }, { upsert: true });

        return res;
    }


    public static async searchUser(userId: string, user?: User) {
        let res = await WarnSchema.findOne({ _id: userId });

        if(!res) {
            res = await new WarnSchema({
                _id: userId,
                warns: [],
                appeals: [],
                bans: 0,
                kicks: 0,
                timeouts: 0,
                verificationStatus: {
                    canVerify: true,
                    timeout: 0,
                },
                verified: false,
            }).save();
        }

        return res;
    }

    public static async verifyUser(userId: string) {
        await this.searchUser(userId);
        await WarnSchema.findOneAndUpdate({ _id: userId }, { verified: true });
    }

    public static async timeoutUser(userId: string, minutes: number) {
        await this.searchUser(userId);
        const r = await WarnSchema.findOneAndUpdate({ _id: userId }, { verificationStatus: {timeout: Date.now() + (minutes * 60 * 1000), canVerify: false} });
        return r.verificationStatus.timeout;
    }

    public static async untimeoutUser(userId: string) {
        await this.searchUser(userId);
        await WarnSchema.findOneAndUpdate({ _id: userId }, { verificationStatus: {timeout: 0, canVerify: true} });
    }
    
}

