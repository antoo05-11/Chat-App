import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    conversation: Array
});

export default mongoose.model('User', userSchema);