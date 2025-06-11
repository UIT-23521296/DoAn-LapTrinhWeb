window.onload = function () {
    fetch('https://backend-yl09.onrender.com/api/user-info', {
        credentials: 'include'
    })
    .then(res => res.status === 401 ? null : res.json())
    .then(data => {
        if (data) {
            document.getElementById('username').textContent = data.username;
            document.getElementById('auth-buttons').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';


            const logoutBtn = document.getElementById("logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    fetch('https://backend-yl09.onrender.com/api/auth/logout', {
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

            if (data.role === "admin") {
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.innerHTML = `
                        <a href="/adminTQ">Quản lý tổng quan</a>
                        <a href="/adminTL">Quản lý tài liệu/blog</a>
                        <a href="/adminND">Quản lý nội dung</a>
                        <a href="" id="logout-btn">Đăng xuất</a>
                    `;
                }
            }
        }
    })
    .catch(err => console.error(err));
};
