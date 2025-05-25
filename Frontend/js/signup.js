const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");

usernameInput.addEventListener("input", function() {
    if (usernameInput.value.length == 0) {
        usernameInput.style.border = "2px solid red";
    } else {
        usernameInput.style.border = "2px solid green";
    }
});

passwordInput.addEventListener("input", function() {
    if (passwordInput.value.length == 0) {
        passwordInput.style.border = "2px solid red";
    } else {
        passwordInput.style.border = "2px solid green";
    }
});

emailInput.addEventListener("input", function() {
    if (emailInput.value.length == 0) {
        emailInput.style.border = "2px solid red";
    } else {
        emailInput.style.border = "2px solid green";
    }
});

document.getElementById("sendOtpBtn").addEventListener("click", function() {
    const email = emailInput.value;

    if (email) {
        //showToast('Mã OTP đã được gửi đến email của bạn.', 'success');

        document.getElementById("otpSection").style.display = "block";
        document.getElementById("registerBtn").disabled = false;
    } else {
        showToast('Vui lòng nhập email hợp lệ.', 'error');
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


document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById('signupForm');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpSection = document.getElementById('otpSection');
    const registerBtn = document.getElementById('registerBtn');
    const backendURL = 'http://localhost:5000';

    let otpSent = false;

    sendOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showToast('Vui lòng nhập email hợp lệ.', 'error');
            return;
        }

        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Đang gửi OTP...';

        try {
            const res = await fetch(`${backendURL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                otpSection.style.display = 'block';
                registerBtn.disabled = false;
                otpSent = true;
                showToast(data.msg, 'success');
            } else {
                showToast(data.msg || 'Gửi OTP thất bại', 'error');
            }
        } catch (error) {
            showToast('Lỗi gửi OTP', 'error');
            console.error(error);
        } finally {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Gửi mã OTP';
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!otpSent) {
            showToast('Vui lòng gửi OTP trước', 'error');
            return;
        }

        const otp = signupForm.OTP.value.trim();
        const email = signupForm.email.value.trim();

        if (!otp) {
            showToast('Vui lòng nhập mã OTP', 'error');
            return;
        }

        try {
            const res = await fetch(`${backendURL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ email, otp })
            });

            if (!res.ok) {
                showToast("OTP không hợp lệ!", 'error');
                return;
            }

            const formData = {
                username: signupForm.username.value.trim(),
                email,
                password: signupForm.password.value.trim()
            };

            if (!formData.username || !formData.password || !formData.email) {
                showToast('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }

            registerBtn.disabled = true;
            registerBtn.textContent = 'Đang đăng ký...';

            const regRes = await fetch(`${backendURL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const regText = await regRes.text();

            let regData;
            try {
                regData = JSON.parse(regText);
            } catch (regParseErr) {
                console.error("Lỗi parse JSON đăng ký:", regParseErr);
                showToast("Lỗi dữ liệu phản hồi khi đăng ký.", 'error');
                return;
            }

            if (regRes.ok) {
                showToast('Đăng ký thành công! Bạn có thể đăng nhập.', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);  
            } else {
                showToast(regData.msg || 'Đăng ký thất bại', 'error');
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            showToast('Lỗi khi đăng ký', 'error');
        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Đăng ký';
        }
    });

    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function() {
            const isPassword = passwordInput.type == "password";
            passwordInput.type = isPassword ? "text" : "password";
            const icon = togglePassword.querySelector("i");
            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);
        });
    }
});
