window.onload = function () {
    fetch('http://localhost:5000/api/user-info', {
        credentials: 'include'
    })
    .then(res => res.status === 401 ? null : res.json())
    .then(data => {
        if (data) {
            document.getElementById('username').textContent = data.username;
            document.getElementById('auth-buttons').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
        }

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();

                fetch('http://localhost:5000/api/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(response => {
                    localStorage.removeItem('user');
                    if (response.redirected) {
                        window.location.href = response.url;
                    } else {
                        window.location.href = '/'; 
                    }
                })
                .catch(err => console.error('Lỗi khi đăng xuất:', err));
            });
        }
    })
    .catch(err => console.error(err));
};
