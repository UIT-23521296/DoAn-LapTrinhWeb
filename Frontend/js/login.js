// Lấy 2 ô input
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Khi người dùng nhập vào username
usernameInput.addEventListener("input", function () {
    if (usernameInput.value.length == 0) {
        usernameInput.style.border = "2px solid red";
    } else {
        usernameInput.style.border = "2px solid green";
    }
});

// Khi người dùng nhập vào password
passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length == 0) {
        passwordInput.style.border = "2px solid red";
    } else {
        passwordInput.style.border = "2px solid green";
    }
});

// Highlight input khi được focus
[usernameInput, passwordInput].forEach(input => {
    input.addEventListener("focus", () => {
        input.style.backgroundColor = "#e6f7ff";
    });
    input.addEventListener("blur", () => {
        input.style.backgroundColor = "white";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput)
    {
        togglePassword.addEventListener("click", function() {
            const isPassword = (passwordInput.type == "password");
            passwordInput.type = isPassword ? "text" : "password";
            const icon = togglePassword.querySelector("i");
            icon.classList.toggle("fa-eye", !isPassword);       // Mắt hiển thị
            icon.classList.toggle("fa-eye-slash", isPassword);  // Mắt bị chéo (ẩn)
        })
    }
})
