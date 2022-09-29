import mongoose from 'mongoose';

const GoodbyeSchema = new mongoose.Schema({
    _id: String,
    goodbyeChannelId: String,
    goodbyeMessage: String,
    toggle: Boolean
});

export default mongoose.model('Goodbye', GoodbyeSchema);