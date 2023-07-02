import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    users: Array,
    lastUpdated: String,
});

export default mongoose.model('Conversation', conversationSchema);