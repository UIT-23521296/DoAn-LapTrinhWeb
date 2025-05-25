// Lấy query param từ URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

window.addEventListener("DOMContentLoaded", async function () {
  const postId = getQueryParam("post");
  if (!postId) {
    showError("Không tìm thấy ID bài viết trong URL");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/blogs/${postId}`);
    if (!res.ok) throw new Error("Không tìm thấy bài viết");
    const blog = await res.json();

    document.getElementById("post-title").innerText = blog.title;
    document.getElementById("post-date").innerText = formatDate(blog.createdAt);
    document.getElementById("post-content").innerHTML = blog.content;
  } catch (err) {
    console.error(err);
    showError("Không tìm thấy hoặc tải bài viết thất bại");
  }
});

function formatDate(dateString) {
  const d = new Date(dateString);
  return isNaN(d) ? "Ngày không hợp lệ" : d.toLocaleDateString("vi-VN");
}

function showError(msg) {
  document.getElementById("post-title").innerText = msg;
  document.getElementById("post-date").innerText = "";
  document.getElementById("post-image").src = "";
  document.getElementById("post-content").innerHTML = `<p>${msg}</p>`;
}


document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.comment-form');
  const textarea = form.querySelector('textarea');
  const commentsList = document.querySelector('.comments-list');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const commentText = textarea.value.trim();
    if (commentText === '') {
      return;
    }
    const newComment = document.createElement('div');
    newComment.classList.add('comment-item');

    newComment.innerHTML = `
      <img src="../assets/img-avatar-1.webp" alt="Avatar" class="avatar">
      <div class="comment-content">
        <strong>Khương Ngọc Toàn</strong>
        <p>${commentText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    `;
    commentsList.appendChild(newComment);
    textarea.value = '';
  });
});