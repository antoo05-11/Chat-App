var user;
function login() {
    let usernameInput = document.getElementById("username-textfield");
    let passwordInput = document.getElementById("password-textfield");

    fetch('/api/auth/login', {
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
            response.json()
                .then(function (data) {
                    if (response.status === 200) {
                        localStorage.setItem('token', data.accessToken);
                        user = data.user;
                        window.location.href = '/chat';
                    } else {
                    
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}