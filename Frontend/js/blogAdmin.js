document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.documents-table tbody');
  const loading = document.getElementById('loading');
  const mainContent = document.getElementById('main');

  // Hàm định dạng ngày (ISO -> dd/mm/yyyy)
  function formatDate(isoDate) {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Tạo 1 dòng row theo blog data
  function createRow(blog, index) {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="document-info">
            <div class="document-title">${escapeHtml(blog.title)}</div>
            <div class="document-description">${escapeHtml(blog.content ? blog.content.substring(0, 100) + '...' : '')}</div>
          </div>
        </td>
        <td>${escapeHtml(blog.author)}</td>
        <td>${formatDate(blog.createdAt)}</td>
        <td>Blog</td>
        <td><span class="status-badge pending">Chờ duyệt</span></td>
        <td>
          <button class="action-btn preview" data-id="${blog._id}"><i class="fas fa-eye"></i> Xem</button>
          <div class="approval-buttons">
            <button class="approve-btn" data-id="${blog._id}" title="Duyệt"><i class="fas fa-check"></i></button>
            <button class="reject-btn" data-id="${blog._id}" title="Từ chối"><i class="fas fa-times"></i></button>
          </div>
        </td>
      </tr>
    `;
  }

  // Escape HTML để tránh lỗi bảo mật
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }

  // Load dữ liệu blog chưa duyệt
  async function loadPendingBlogs() {
    try {
      const res = await fetch('/api/admin/pending-blogs');
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
      const blogs = await res.json();

      if (blogs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Không có tài liệu chờ duyệt</td></tr>';
      } else {
        tableBody.innerHTML = blogs.map((blog, i) => createRow(blog, i)).join('');
      }

      // Hiển thị content chính, ẩn loading
      loading.style.display = 'none';
      mainContent.style.display = 'block';

      // Thêm sự kiện cho nút duyệt/từ chối
      addEventListeners();
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Lỗi khi tải dữ liệu</td></tr>';
      loading.style.display = 'none';
      mainContent.style.display = 'block';
    }
  }

  // Hàm gửi yêu cầu duyệt bài
  async function approveBlog(id) {
    try {
      const res = await fetch(`/api/admin/approve-blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Duyệt bài thất bại');
      alert('Duyệt bài thành công!');
      loadPendingBlogs();
    } catch (err) {
      alert(err.message);
    }
  }

  // Hàm gửi yêu cầu từ chối bài (nếu có API thì gọi, hoặc có thể xóa bài hoặc update trạng thái)
  async function rejectBlog(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: 'DELETE',
      credentials: 'include', // nếu backend dùng session
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Lỗi khi từ chối bài viết');
    }

    alert('Đã xóa bài viết!');

    loadPendingBlogs();

    const blogRow = document.querySelector(`.blog-row[data-id="${id}"]`);
    if (blogRow) blogRow.remove();
  } catch (err) {
    alert('Lỗi: ' + err.message);
  }
}

  // Thêm sự kiện click cho nút duyệt và từ chối
  function addEventListeners() {
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Bạn có chắc muốn duyệt tài liệu này không?')) {
          approveBlog(id);
        }
      });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Bạn có chắc muốn từ chối tài liệu này không?')) {
          rejectBlog(id);
        }
      });
    });

    // Nút xem (preview) bạn có thể implement mở modal xem chi tiết ở đây
    document.querySelectorAll('.action-btn.preview').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            window.location.href = `/blog-read?post=${id}&preview=true`;
        });
    });

  }
  // Load khi trang được tải
  loadPendingBlogs();
});
