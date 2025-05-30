document.addEventListener('DOMContentLoaded', async () => {
  // Cập nhật thống kê từ API
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();

    document.getElementById('total-documents').textContent = data.totalDocuments;
    document.getElementById('total-users').textContent = data.totalUsers;
    document.getElementById('pending-docs').textContent = data.pendingBlogs;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  // --- Phần load và render blog ---
  const tableBody = document.querySelector('.table-container table tbody');
  if (!tableBody) {
    console.error('Không tìm thấy tbody!');
    return;
  }

  function formatDate(isoDate) {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }

  function createRow(blog) {
    const statusClass = blog.approved ? 'approved' : 'pending';
    const statusText = blog.approved ? 'Đã duyệt' : 'Chờ duyệt';

    return `
      <tr data-id="${blog._id}">
        <td>${escapeHtml(blog.title)}</td>
        <td>${escapeHtml(blog.author)}</td>
        <td>${formatDate(blog.createdAt)}</td>
        <td>Blog</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-btn view" data-id="${blog._id}" title="Xem"><i class="fas fa-eye"></i></button>
          <button class="action-btn delete" data-id="${blog._id}" title="Xóa"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }

  async function loadBlogs() {
    try {
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
      const data = await res.json();

      const { approvedBlogs = [], pendingBlogs = [] } = data;
      const allBlogs = [...pendingBlogs, ...approvedBlogs];

      if (allBlogs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có tài liệu</td></tr>';
      } else {
        tableBody.innerHTML = allBlogs.map(createRow).join('');
      }

      addEventListeners();
    } catch (err) {
      console.error('Lỗi khi load blog:', err);
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">Lỗi khi tải dữ liệu</td></tr>';
    }
  }

  async function deleteBlog(id) {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Xóa tài liệu thất bại');

      showToast('Xóa tài liệu thành công!', 'success');
      loadBlogs();
    } catch (err) {
     showToast('Lỗi: ' + err.message, 'error');
    }
  }

  function addEventListeners() {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.location.href = `/blog-read?post=${id}&preview=true`;
      });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        showConfirmModal('Bạn có chắc muốn xóa tài liệu này không?', () => {
          deleteBlog(id);
        });
      });
    });
  }

  loadBlogs();
});
function showToast(message, type = 'success') {
    const toastE1 = document.getElementById("liveToast");
    const toastBody = toastE1.querySelector(".toast-body");

    // Xóa hết class bg- cũ, giữ lại border-0
    toastE1.classList.remove("bg-success", "bg-danger", "text-white");

    if (type === 'error') {
        toastE1.classList.add("bg-danger", "text-white");
    } else {
        toastE1.classList.add("bg-success", "text-white");
    }

    toastBody.innerHTML = message;

    const toast = new bootstrap.Toast(toastE1, {
        delay: 2000,
        autohide: true
    });

    toast.show();
}
function showConfirmModal(message, onConfirm) {
  const modalEl = document.getElementById("confirmModal");
  const messageEl = document.getElementById("confirmModalMessage");
  const confirmBtn = document.getElementById("confirmModalOk");

  messageEl.textContent = message;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();

  // Gỡ sự kiện cũ và gán mới
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener("click", () => {
    bsModal.hide();
    onConfirm();
  });
}
