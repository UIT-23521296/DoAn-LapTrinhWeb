let subjectNamesByType = {};

document.addEventListener("DOMContentLoaded", function () {
    // === PHẦN UPLOAD ===
    const fileInput = document.getElementById("fileUpload");
    const afterUpload = document.getElementById("after-upload");
    const fileNameDisplay = afterUpload.querySelector(".file-info a");
    const uploadNextBtn = document.getElementById("next-btn");

    afterUpload.style.display = "none";

    fileInput.addEventListener("change", function () {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            if (!allowedTypes.includes(file.type)) {
                alert("Chỉ cho phép upload file PDF hoặc DOC/DOCX.");
                fileInput.value = "";
                afterUpload.style.display = "none";
                return;
            }

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

    nextButton.style.display = "none";

    const subjectTypeSelect = formDetail.querySelector('select[name="subjectType"]');
    const subjectNameSelect = formDetail.querySelector('select[name="subjectName"]');
    const documentTypeSelect = formDetail.querySelector('select[name="documentType"]');
    const titleInput = formDetail.querySelector('input[name="title"]');
    const descriptionInput = formDetail.querySelector('textarea[name="description"]');

    fetch('/json/data.json')
    .then(response => {
        if (!response.ok) throw new Error("Không tải được dữ liệu môn học");
        return response.json();
    })
    .then(data => {
        subjectNamesByType = data;
    })
    .catch(error => {
        console.error("Lỗi khi tải dữ liệu môn học:", error);
    });

    // Hàm cập nhật danh sách môn học theo loại môn học
    function updateSubjectNames() {
        const selectedType = subjectTypeSelect.value;
        // Xóa option cũ trừ option đầu tiên
        subjectNameSelect.innerHTML = '<option value="">-- Chọn tên môn học --</option>';

        if (selectedType && subjectNamesByType[selectedType]) {
            subjectNamesByType[selectedType].forEach(name => {
                const option = document.createElement("option");
                option.value = name.toLowerCase().replace(/\s+/g, "-");
                option.textContent = name;
                subjectNameSelect.appendChild(option);
            });
        }
        toggleDetailNextButton(); // Cập nhật nút next khi đổi danh sách
    }

    function validateDetailForm() {
        return (
            subjectTypeSelect.value !== "" &&
            subjectNameSelect.value !== "" &&
            documentTypeSelect.value !== "" &&
            titleInput.value.trim() !== ""
            //descriptionInput.value.trim() !== ""
        );
    }

    function toggleDetailNextButton() {
        if (validateDetailForm()) {
            nextButton.style.display = "inline-block";
        } else {
            nextButton.style.display = "none";
        }
    }

    subjectTypeSelect.addEventListener("change", () => {
        updateSubjectNames();
    });

    [subjectTypeSelect, subjectNameSelect, documentTypeSelect, titleInput, descriptionInput].forEach(el => {
        el.addEventListener("input", toggleDetailNextButton);
        el.addEventListener("change", toggleDetailNextButton);
    });

    formDetail.addEventListener("click", async function (e) {
        e.preventDefault();

        if (!validateDetailForm()) return;

        const file = fileInput.files[0];
        if (!file) {
            alert("Chưa có file được chọn.");
            return;
        }

        const formData = new FormData(formDetail);
        formData.append("file", file);

        try {
            const response = await fetch(`${window.location.origin}/api/upload`, {
                method: "POST",
                body: formData
            });


            if (!response.ok) {
                throw new Error("Upload thất bại");
            }

            document.getElementById("detail").classList.remove("active");
            document.getElementById("done").classList.add("active");
        } catch (error) {
            alert("Lỗi khi upload: " + error.message);
        }
    });

    // === PHẦN DONE ===
    const doneBtn = document.querySelector(".done-button");
});
