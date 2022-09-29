import mongoose from 'mongoose';

const WarnSchema = new mongoose.Schema({
    _id: String, // userId
    warns: [{
        moderatorId: String,
        reason: String,
        timestamp: Number,
        id: String,
        points: Number,
    }],
    appeals: [{
        message: String,
        timestamp: Number,
        accepted: Boolean
    }],
    verified: Boolean,
    verificationStatus: {
        canVerify: Boolean,
        timeout: Number,
    },
    bans: Number,
    kicks: Number,
    timeouts: Number,
});

export default mongoose.model('User', WarnSchema);