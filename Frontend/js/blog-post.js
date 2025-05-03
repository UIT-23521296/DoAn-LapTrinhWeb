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
let savedRange = null;

document.addEventListener("DOMContentLoaded", function () {
    const postContent = document.getElementById("postContent");

    postContent.addEventListener("mouseup", saveCursorPosition);
    postContent.addEventListener("keyup", saveCursorPosition);

    function saveCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            savedRange = selection.getRangeAt(0);
        }
    }
});

function insertImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    const postContent = document.getElementById("postContent");

    if (file && postContent) {
        const reader = new FileReader();
        reader.onload = function(e) {
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
            } else {
                postContent.appendChild(imgElement); 
            }
        };
        reader.readAsDataURL(file);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const emojiBtn = document.querySelector('.fa-smile');
    const emojiPicker = document.getElementById('emojiPicker');
    const postContent = document.getElementById('postContent');

    emojiBtn.addEventListener('click', function(event) {
        if (emojiPicker.style.display === 'none') {
            emojiPicker.style.display = 'block';
        } else {
            emojiPicker.style.display = 'none';
        }
    });

    emojiPicker.addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;

        const selection = window.getSelection();

        if (!selection.rangeCount || !postContent.contains(selection.anchorNode)) {

            postContent.appendChild(document.createTextNode(emoji));
        } else {
            const range = selection.getRangeAt(0);

            range.insertNode(document.createTextNode(emoji));

            range.setStartAfter(range.endContainer);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        emojiPicker.style.display = 'none';
    });
});

function submitPost() {

    const postContent = document.getElementById("postContent");
    postContent.innerHTML = '';


    const imageInput = document.getElementById("imageUpload");
    imageInput.value = '';
}