import mongoose from 'mongoose';

const LogsSchema = new mongoose.Schema({
    _id: String,
    logsChannelId: String,
    toggle: Boolean
});

export default mongoose.model('Logs', LogsSchema);