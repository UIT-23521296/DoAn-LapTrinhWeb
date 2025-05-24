
let savedRange = null;

document.addEventListener("DOMContentLoaded", function () {
    const postContent = document.getElementById("postContent");
    const emojiBtn = document.querySelector('.fa-smile');
    const emojiPicker = document.getElementById('emojiPicker');

    // Ghi nhớ vị trí con trỏ
    postContent.addEventListener("mouseup", saveCursorPosition);
    postContent.addEventListener("keyup", saveCursorPosition);

    function saveCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && postContent.contains(selection.anchorNode)) {
            savedRange = selection.getRangeAt(0);
        }
    }

    // Toggle Emoji Picker
    emojiBtn.addEventListener('click', function () {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    // Chèn emoji
    emojiPicker.addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;

        const span = document.createElement("span");
        span.textContent = emoji;
        span.style.display = "inline-block";

        const selection = window.getSelection();

        if (selection.rangeCount > 0 && postContent.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(span);
            range.setStartAfter(span);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            savedRange = range; // ✅ Cập nhật lại savedRange sau khi chèn emoji
        } else if (savedRange) {
            const range = savedRange;
            range.deleteContents();
            range.insertNode(span);
            range.setStartAfter(span);
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            savedRange = range;
        } else {
            postContent.insertAdjacentElement("beforeend", span);
        }

        emojiPicker.style.display = 'none';
    });
});

// Hàm chèn ảnh
function insertImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    const postContent = document.getElementById("postContent");

    if (file && postContent) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement("img");
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = "80%";
            imgElement.style.maxHeight = "300px";
            imgElement.style.height = "auto";
            imgElement.style.display = "block";
            imgElement.style.margin = "10px 0";

            if (savedRange) {
                const range = savedRange;
                range.deleteContents();
                range.insertNode(imgElement);
                range.setStartAfter(imgElement);
                range.collapse(true);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                savedRange = range; // ✅ Cập nhật lại savedRange sau khi chèn ảnh
            } else {
                postContent.appendChild(imgElement);
            }
        };
        reader.readAsDataURL(file);
    }
}

function submitPost() {

    const postContent = document.getElementById("postContent");
    postContent.innerHTML = '';
    const imageInput = document.getElementById("imageUpload");
    imageInput.value = '';
}