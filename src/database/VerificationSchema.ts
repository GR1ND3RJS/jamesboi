import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
    _id: String,
    verificationChannelId: String,
    prevVerificationChannelId: String,
    verificationRoleId: String,
    verificationMessage: String,
    verifiedCount: Number,
    verificationId: String,
});

export default mongoose.model('Verification', VerificationSchema);