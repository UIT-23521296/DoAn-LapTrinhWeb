const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");

usernameInput.addEventListener("input", function() {
    if (usernameInput.value.length == 0)
    {
        usernameInput.style.border = "2px solid red";
    }
    else
    {
        usernameInput.style.border = "2px solid green";
    }
})

passwordInput.addEventListener("input", function() {
    if (passwordInput.value.length == 0)
    {
        passwordInput.style.border = "2px solid red";
    }
    else
    {
        passwordInput.style.border = "2px solid green";
    }
})

emailInput.addEventListener("input", function() {
    if (emailInput.value.length == 0)
    {
        emailInput.style.border = "2px solid red";
    }
    else
    {
        emailInput.style.border = "2px solid green";
    }
})

document.getElementById("sendOtpBtn").addEventListener("click", function() {
    const email = emailInput.value;

    if (email)
    {
        showToast('Mã OTP đã được gửi đến email của bạn.');

        document.getElementById("otpSection").style.display = "block";
        document.getElementById("registerBtn").disabled = false;
    }
    else
    {
        showToast('Vui lòng nhập email hợp lệ.');
    }
})

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Kiểm tra mã OTP
    const otp = document.getElementById('OTP').value;
    if (otp) {
        // Thực hiện đăng ký hoặc gửi dữ liệu đi
        showToast('Đăng ký thành công!');
        // Thực hiện chuyển hướng đến trang đăng nhập hoặc trang khác nếu cần
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    } else {
        showToast('Vui lòng nhập mã OTP.')
    }
});

function showToast(message) {
    const toastE1 = document.getElementById("liveToast");
    const toast = new bootstrap.Toast(toastE1, {
        delay: 3000,
        autohide: true
    });

    toastE1.querySelector(".toast-body").innerHTML = message;

    toast.show();
}

document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput)
    {
        togglePassword.addEventListener("click", function() {
            const isPassword = passwordInput.type == "password";
            passwordInput.type = isPassword ? "text" : "password";
            const icon = togglePassword.querySelector("i")
            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);
        })
    }
})