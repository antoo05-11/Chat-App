function login() {
    let usernameInput = document.getElementById("username-textfield");
    let passwordInput = document.getElementById("password-textfield");

    fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');
            botMessage.textContent = 'Bot: ' + data.message;
            chatContainer.appendChild(botMessage);

            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(function (error) {
            // Xử lý lỗi nếu có
            console.error('Error:', error);
        });

}