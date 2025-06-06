document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/user-info', {
            credentials: 'include' // rất quan trọng để gửi cookie
        });

        if (!response.ok) throw new Error('Không lấy được dữ liệu người dùng');

        const data = await response.json();
        console.log("User info:", data);

        // Điền dữ liệu vào input
        document.getElementById('username_').value = data.username;
        document.getElementById('email').value = data.email;
    } catch (err) {
        console.error(err);
        alert("Lỗi tải thông tin người dùng. Vui lòng đăng nhập lại.");
    }
});
