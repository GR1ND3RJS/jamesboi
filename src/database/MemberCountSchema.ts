import mongoose from 'mongoose';

const LogsSchema = new mongoose.Schema({
    _id: String,
    mChannelId: String,
    toggle: Boolean
});

export default mongoose.model('Member', LogsSchema);