const socket = io()
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
                window.location.href = response.url;
            } else {
                
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}
