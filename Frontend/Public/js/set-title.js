document.addEventListener("DOMContentLoaded", function () {
    // Lấy đường dẫn file
    const pathParts = window.location.pathname.split("/");
    const file = pathParts[pathParts.length - 1];  // lấy tên file (ví dụ: mon-dai-cuong.html)

    // Môn học lớn (chỉ dùng tên file không có .html)
    const majorMap = {
      "mon-dai-cuong.html": "Đại cương",
      "mon-chinh-tri.html": "Chính trị",
      "mon-co-so-nganh.html": "Cơ sở ngành",
      "mon-chuyen-nganh.html": "Chuyên ngành",
      "mon-tu-chon.html": "Tự chọn"
    };

    // Môn học nhỏ
    const minorMap = {
      "triet-hoc.html": "Triết học",
      "tu-tuong-hcm.html": "Tư tưởng Hồ Chí Minh",
      "ly-luan-chinh-tri.html": "Lý luận chính trị"
    };

    const major = majorMap[file] || "";  // Tra cứu môn học lớn
    const minor = minorMap[file] || "";  // Tra cứu môn học nhỏ

    // Cập nhật breadcrumb và title nếu tìm thấy
    if (major && minor) {
      document.title = `Tài liệu > ${major} > ${minor}`;
      const bc = document.getElementById("breadcrumb");
      if (bc) bc.textContent = `Tài liệu > ${major} > ${minor}`;
    }
});
