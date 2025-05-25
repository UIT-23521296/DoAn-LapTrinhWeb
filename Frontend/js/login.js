document.addEventListener("DOMContentLoaded", function () {
    // Lấy 2 ô input
    const email = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Khi người dùng nhập vào username
    email.addEventListener("input", function () {
        email.style.border = email.value.length === 0 ? "2px solid red" : "2px solid green";
    });

    // Khi người dùng nhập vào password
    passwordInput.addEventListener("input", function () {
        passwordInput.style.border = passwordInput.value.length === 0 ? "2px solid red" : "2px solid green";
    });

    // Highlight input khi được focus
    [email, passwordInput].forEach(input => {
        input.addEventListener("focus", () => {
            input.style.backgroundColor = "#e6f7ff";
        });
        input.addEventListener("blur", () => {
            input.style.backgroundColor = "white";
        });
    });

    // Form login
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) return;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify({
                    username: data.user.username || '',
                    email: data.user.email || ''
                }));
                showToast('Đăng nhập thành công! Chào mừng ', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);  
            } else {
                showToast('Đăng nhập thất bại: ' + (data.msg || 'Lỗi không xác định'), 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối đến server: ' + error.message, 'error');
        }
    });

    // Toggle password visibility
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            const icon = togglePassword.querySelector("i");
            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);
        });
    }
});

function showToast(message, type = 'success') {
    const toastE1 = document.getElementById("liveToast");
    const toastBody = toastE1.querySelector(".toast-body");

    // Xóa hết class bg- cũ, giữ lại border-0
    toastE1.classList.remove("bg-success", "bg-danger", "text-white");

    if (type === 'error') {
        toastE1.classList.add("bg-danger", "text-white");
    } else {
        toastE1.classList.add("bg-success", "text-white");
    }

    toastBody.innerHTML = message;

    const toast = new bootstrap.Toast(toastE1, {
        delay: 3000,
        autohide: true
    });

    toast.show();
}