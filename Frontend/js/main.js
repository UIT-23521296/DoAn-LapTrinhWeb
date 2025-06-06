function toggleMenu() {
    const menu = document.getElementById("side-nav");
    const mainContent = document.querySelector('.main-content');
    
    // Toggle active class cho sidebar
    menu.classList.toggle("active");
    
    // Toggle lớp sidebar-open cho body
    document.body.classList.toggle("sidebar-open");
    
    // Tạo hoặc toggle overlay
    let overlay = document.querySelector('.sidebar-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = toggleMenu; // Click overlay để đóng sidebar
        mainContent.appendChild(overlay);
    }
    
    // Toggle hiển thị overlay
    overlay.style.display = menu.classList.contains('active') ? 'block' : 'none';
    
    // Ngăn scroll khi sidebar mở dưới 780px
    if (window.innerWidth <= 780) {
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
} else {
    document.body.style.overflow = '';
}

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
// Kiểm tra kích thước màn hình và áp dụng overlay nếu cần
const checkScreenSize = () => {
    const menu = document.getElementById("side-nav");
    if (!menu) return;

    const overlay = document.querySelector('.sidebar-overlay');

    if (window.innerWidth <= 780) {
        menu.classList.add('mobile-overlay');
    } else {
        menu.classList.remove('mobile-overlay');
        menu.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const usernameEl = document.getElementById('username');
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main');
    checkScreenSize();

    const setupLogoutListener = () => {
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
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
    };

    const showContentAfterDelay = (callback) => {
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (callback) callback();
        }, 1000);
    };

    // Kiểm tra khi thay đổi kích thước cửa sổ
    window.addEventListener('resize', checkScreenSize);

    fetch('http://localhost:5000/api/user-info', { credentials: 'include' })
        .then(res => res.status === 401 ? null : res.json())
        .then(data => {
            showContentAfterDelay(() => {
                if (data && data.username) {
                    usernameEl.textContent = data.username;
                    authButtons.style.display = 'none';
                    userInfo.style.display = 'block';

                    const dropdownMenu = document.querySelector('.dropdown-menu');
                    if (dropdownMenu && data.role === "admin") {
                        dropdownMenu.innerHTML = `
                            <a href="/adminTQ">Quản lý tổng quan</a>
                            <a href="/adminTL">Quản lý tài liệu/blog</a>
                            <a href="#" id="logout-btn">Đăng xuất</a>
                        `;
                    }

                    // Gán lại sự kiện sau khi innerHTML đã được cập nhật (dù là user hay admin)
                    setupLogoutListener();
                }
            });
        })
        .catch(err => {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            showContentAfterDelay(); // Vẫn hiển thị nội dung sau 1s dù có lỗi
    });
    
    const input = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');
    const typeSelect = document.getElementById('search-type');
    let timeoutId;

    if (!input || !suggestions || !typeSelect) {
        console.warn('Search elements not found in DOM.');
        return; // Không chạy tiếp nếu thiếu element
    }

    const fetchSuggestions = (query = '') => {
        const type = typeSelect.value;
        if (type !== 'blog') {
        suggestions.style.display = 'none';
        return;
        }

        // Gọi API tùy query hoặc default
        const url = query
        ? `http://localhost:5000/api/blogs/search?q=${encodeURIComponent(query)}`
        : `http://localhost:5000/api/blogs/search?default=true`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            suggestions.innerHTML = '';
            if (!data.length) {
            suggestions.style.display = 'none';
            return;
            }

            data.forEach(blog => {
            const li = document.createElement('li');
            li.textContent = blog.title;
            li.addEventListener('click', () => {
                window.location.href = `/blog-read?post=${blog._id}`;
            });
            suggestions.appendChild(li);
            });

            suggestions.style.display = 'block';
        })
        .catch(err => {
            console.error('Lỗi lấy blog:', err);
            suggestions.style.display = 'none';
        });
    };

    input.addEventListener('focus', () => {
        if (typeSelect.value === 'blog') {
        fetchSuggestions();
        }
    });

    input.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
        fetchSuggestions(input.value.trim());
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
        suggestions.style.display = 'none';
        }
    });

    // Ẩn suggestion khi chọn loại khác
    typeSelect.addEventListener('change', () => {
        suggestions.style.display = 'none';
    });
});

