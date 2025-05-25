
let savedRange = null;

function getLocalStorage(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        // Nếu không có dữ liệu thì trả về null hoặc giá trị mặc định
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const usernameE2 = document.getElementById('username2');
    const userInfo = getLocalStorage('user');
    usernameE2.innerHTML = userInfo.username;

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
    const postTitle = document.getElementById("postTitle").value.trim();
    const postContent = document.getElementById("postContent").innerHTML.trim();

    if (!postTitle) {
        alert("Vui lòng nhập tiêu đề bài viết!");
        return;
    }

    if (!postContent) {
        alert("Nội dung bài viết không được để trống!");
        return;
    }

    const postData = {
        title: postTitle,
        content: postContent,
    };

    fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(postData)
    })
    .then(res => {
        if (!res.ok) throw new Error('Lỗi khi đăng bài');
        return res.json();
    })
    .then(data => {
        alert('Đăng bài thành công!');
        // Xóa form hoặc chuyển hướng
        document.getElementById("postTitle").value = '';
        document.getElementById("postContent").innerHTML = '';
        document.getElementById("imageUpload").value = '';
        // Ví dụ chuyển về trang blog list
        window.location.href = '/blog';
    })
    .catch(err => {
        alert('Đã xảy ra lỗi: ' + err.message);
    });
}