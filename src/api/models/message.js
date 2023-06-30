import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationID: Number,
    dateTime: String,
    sender: Number,
    content: String
});

export default mongoose.model('Message', messageSchema);