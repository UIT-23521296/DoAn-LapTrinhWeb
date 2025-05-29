document.addEventListener("DOMContentLoaded", function () {
    // === PHẦN UPLOAD ===
    const fileInput = document.getElementById("fileUpload");
    const afterUpload = document.getElementById("after-upload");
    const fileNameDisplay = afterUpload.querySelector(".file-info a");
    const uploadNextBtn = document.getElementById("next-btn");

    // Ẩn tên file và nút next ban đầu
    afterUpload.style.display = "none";

    fileInput.addEventListener("change", function () {
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            if (!allowedTypes.includes(file.type)) {
                alert("Chỉ cho phép upload file PDF hoặc DOC/DOCX.");
                fileInput.value = ""; // Xóa file không hợp lệ
                afterUpload.style.display = "none";
                return;
            }

            // Hiện tên file nếu hợp lệ
            fileNameDisplay.textContent = file.name;
            afterUpload.style.display = "flex";
        } else {
            afterUpload.style.display = "none";
        }
    });


    uploadNextBtn.addEventListener("click", function () {
        document.getElementById("upload").classList.remove("active");
        document.getElementById("detail").classList.add("active");
    });


    // === PHẦN DETAIL ===
    const formDetail = document.querySelector(".form-container");
    const nextButton = formDetail.querySelector(".next-button");

    // Ẩn nút Next detail ban đầu
    nextButton.style.display = "none";

    const subjectSelect = formDetail.querySelectorAll(".detail-select")[0];
    const yearSelect = formDetail.querySelectorAll(".detail-select")[1];
    const titleInput = formDetail.querySelector(".detail-title-input");
    const descriptionInput = formDetail.querySelector("textarea");

    function validateDetailForm() {
        const subjectValid = subjectSelect.value !== "Please select";
        const yearValid = yearSelect.value !== "Please select";
        const titleValid = titleInput.value.trim() !== "";
        const descriptionValid = descriptionInput.value.trim() !== "";

        return subjectValid && yearValid && titleValid && descriptionValid;
    }

    function toggleDetailNextButton() {
        if (validateDetailForm()) {
            nextButton.style.display = "inline-block";
        } else {
            nextButton.style.display = "none";
        }
    }

    [subjectSelect, yearSelect, titleInput, descriptionInput].forEach(el => {
        el.addEventListener("input", toggleDetailNextButton);
        el.addEventListener("change", toggleDetailNextButton);
    });

    formDetail.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    if (!validateDetailForm()) return;

    const file = fileInput.files[0];
    if (!file) {
        alert("Chưa có file được chọn.");
        return;
    }

    const formData = new FormData(formDetail);
    formData.append("file", file);
    formData.append("uploader", "test_user"); // hoặc lấy từ localStorage/session

    try {
        const response = await fetch(`${window.location.origin}/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Upload thất bại");
        }

        // Nếu thành công, chuyển bước
        document.getElementById("detail").classList.remove("active");
        document.getElementById("done").classList.add("active");
    } catch (error) {
        alert("Lỗi khi upload: " + error.message);
    }
});



    // === PHẦN DONE ===
    const doneBtn = document.querySelector(".done-button");
});