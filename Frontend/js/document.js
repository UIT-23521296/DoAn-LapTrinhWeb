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
  