const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

if (username && password) {
    window.location.href = '/chatbox';
} else {

}

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
            if (response.redirected) {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                window.location.href = response.url;
                console.log(response.url);
            } else {

            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}