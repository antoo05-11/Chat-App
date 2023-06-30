import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationID: Number,
    dateTime: String,
    sender: String,
    content: String
});

export default mongoose.model('Message', messageSchema);