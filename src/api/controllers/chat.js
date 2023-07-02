import User from "../models/user";
import Conversation from "../models/conversation";

export const getAllChats = async (req, res) => {
    let user = req.user;
    res.status(200).json(user);
};

export const addChat = async (req, res) => {
    const foundUser = await User.findOne({
        username: req.body.username
    });
    let users = [foundUser.id, req.user.id];
    let conversation = await Conversation.findOne({
        users: {
            $all: users
        }
    });
    if (!conversation) {
        conversation = await Conversation.create({
            users: users,
            lastUpdated: new Date().toISOString()
        });
        await User.findOneAndUpdate({
                username: foundUser.username
            }, {
                $push: {
                    conversation: conversation._id
                }
            }, {
                new: true
            })
            .then((updatedUser) => {
                if (updatedUser) {
                    console.log("User updated successfully!");
                } else {
                    console.log("User not found");
                }
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
        await User.findOneAndUpdate({
                username: req.user.username
            }, {
                $push: {
                    conversation: conversation._id
                }
            }, {
                new: true
            })
            .then((updatedUser) => {
                if (updatedUser) {
                    console.log("User updated successfully:", updatedUser);
                } else {
                    console.log("User not found");
                }
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
            });
    }
    res.status(200).json({
        conversation
    });
}