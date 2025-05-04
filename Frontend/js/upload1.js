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
const fileInput = document.getElementById("fileUpload");
  const afterUpload = document.getElementById("after-upload");
  const afterLink   = afterUpload.querySelector("a");

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      // Hiển thị khối after-upload
      afterUpload.style.display = "block";
      // Cập nhật nội dung
      afterLink.innerHTML = `<span class="icon">📄</span> ${fileName}`;
    } else {
      // Nếu bỏ chọn (nếu có), lại ẩn khối
      afterUpload.style.display = "none";
    }
  });
  


