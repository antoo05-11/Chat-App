import User from "../modeIs/user";
import Message from "../modeIs/message";

export const login = async (req, res) => {
    console.log(req);
    const {
        username,
        password
    } = req.body;
    let user = {
        username: username,
        password: password
    }
    await User.findOne(user)
        .then((foundUser) => {
            if (foundUser) {
                console.log('Đã tìm thấy người dùng trong cơ sở dữ liệu:', foundUser);
                res.redirect('/chatbox');
 
                io.on('connection', (socket) => {
                    socket.emit('user-info', foundUser);
                })

                let conversation = foundUser.conversation;
                conversation.forEach(element => {
                    Message.find({
                            conversationID: element
                        })
                        .then((message) => {
                            io.on('connection', (socket) => {
                                socket.emit('message', message);
                            })
                        })
                        .catch((error) => {
                            console.error('Lỗi truy vấn dữ liệu:', error);
                        });
                });
            } else {
                console.log('Người dùng không tồn tại trong cơ sở dữ liệu');
            }
        })
        .catch((error) => {
            console.error('Lỗi truy vấn dữ liệu:', error);
        });
}