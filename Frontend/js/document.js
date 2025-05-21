// Đảm bảo chạy sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#rating-stars .star");

    stars.forEach(star => {
        star.addEventListener("click", () => {
        const val = parseInt(star.dataset.value, 10);

        stars.forEach(s => {
            const sVal = parseInt(s.dataset.value, 10);
            // Nếu giá trị <= giá trị click thì active, ngược lại bỏ active
            if (sVal <= val) {
                s.classList.add("active");
            } else {
                s.classList.remove("active");
            }
        });
    });
});
});
  