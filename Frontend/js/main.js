function toggleMenu() {
    const menu = document.getElementById("side-nav");
    menu.classList.toggle("active");
    document.body.classList.toggle("sidebar-open");
}

function toggleSubmenu(element) {
    const subMenu = element.nextElementSibling;
    if (subMenu && subMenu.classList.contains('sub-menu')) 
    {
        subMenu.style.display = (subMenu.style.display === 'flex') ? 'none' : 'flex';

        const icon = element.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const usernameEl = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main');

    // Hàm xử lý hiển thị nội dung sau 3 giây
    const showContentAfterDelay = (callback) => {
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (callback) callback();
        }, 1000); // 3 giây
    };

    // Gọi API lấy thông tin người dùng
    fetch('http://localhost:5000/api/user-info', { credentials: 'include' })
        .then(res => res.status === 401 ? null : res.json())
        .then(data => {
            showContentAfterDelay(() => {
                if (data && data.username) {
                    usernameEl.textContent = data.username;
                    authButtons.style.display = 'none';
                    userInfo.style.display = 'block';
                } 

                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        fetch('http://localhost:5000/api/auth/logout', {
                            method: 'GET',
                            credentials: 'include'
                        })
                        .then(response => {
                            window.location.href = response.redirected ? response.url : '/';
                        })
                        .catch(err => console.error('Lỗi khi đăng xuất:', err));
                    });
                }
            });
        })
        .catch(err => {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            showContentAfterDelay(); // Vẫn hiển thị nội dung sau 3s dù có lỗi
        });
});
