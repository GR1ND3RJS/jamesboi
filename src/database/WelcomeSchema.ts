import mongoose from 'mongoose';

const WelcomeSchema = new mongoose.Schema({
    _id: String,
    welcomeChannelId: String,
    welcomeMessage: String,
    toggle: Boolean
});

export default mongoose.model('Welcome', WelcomeSchema);