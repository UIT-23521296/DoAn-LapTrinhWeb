document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.documents-table table tbody');
  const loading = document.getElementById('loading');
  const mainContent = document.getElementById('main');
  const statusFilter = document.getElementById('filter-status');
  const subjectFilter = document.getElementById('filter-subject');
  const searchInput = document.querySelector('.search-box input');

  if (!tableBody) {
    console.error('Không tìm thấy tbody!');
    return;
  }

  if (!loading || !mainContent) {
    console.warn('Thiếu phần tử #loading hoặc #main trong HTML!');
  }

  let allBlogs = [];
  
  function formatDate(isoDate) {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function createRow(blog, index) {
    const isApproved = blog.approved === true; // Dùng Boolean đúng cách
    const contentPreview = typeof blog.content === 'string'
      ? blog.content.substring(0, 100) + '...'
      : '';

    return `
      <tr class="blog-row" data-id="${blog._id}">
        <td>${index + 1}</td>
        <td>
          <div class="document-info">
            <div class="document-title">${escapeHtml(blog.title)}</div>
            <div class="document-description">${escapeHtml(contentPreview)}</div>
          </div>
        </td>
        <td>${escapeHtml(blog.author)}</td>
        <td>${formatDate(blog.createdAt)}</td>
        <td>Blog</td>
        <td>
          <span class="status-badge ${isApproved ? 'approved' : 'pending'}">
            ${isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
          </span>
        </td>
        <td>
          <button class="action-btn preview" data-id="${blog._id}">
            <i class="fas fa-eye"></i> Xem
          </button>
          ${
            isApproved
              ? ''
              : `
                <div class="approval-buttons">
                  <button class="approve-btn" data-id="${blog._id}" title="Duyệt"><i class="fas fa-check"></i></button>
                  <button class="reject-btn" data-id="${blog._id}" title="Từ chối"><i class="fas fa-times"></i></button>
                </div>
              `
          }
        </td>
      </tr>
    `;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }

  async function loadBlogs() {
    try {
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
      const data = await res.json();

      console.log('Data nhận được:', data);

      const { approvedBlogs = [], pendingBlogs = [] } = data;
      allBlogs = [...pendingBlogs, ...approvedBlogs];

      filterAndRender();

      if (approvedBlogs.length === 0 && pendingBlogs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Không có tài liệu</td></tr>';
      } else {
        const allBlogs = [...pendingBlogs, ...approvedBlogs];
        tableBody.innerHTML = allBlogs.map((blog, i) => createRow(blog, i)).join('');
      }

      if (loading) loading.style.display = 'none';
      if (mainContent) mainContent.style.display = 'block';

      addEventListeners();
    } catch (err) {
      console.error('Lỗi khi load blog:', err);
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Lỗi khi tải dữ liệu</td></tr>';
      if (loading) loading.style.display = 'none';
      if (mainContent) mainContent.style.display = 'block';
    }
  }

  async function approveBlog(id) {
    try {
      const res = await fetch(`/api/admin/approve-blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Duyệt bài thất bại');
      alert('Duyệt bài thành công!');
      const row = document.querySelector(`button.approve-btn[data-id="${id}"]`).closest('tr');
      const badge = row.querySelector('.status-badge');
      badge.textContent = 'Đã duyệt';
      badge.classList.remove('pending');
      badge.classList.add('approved');
      const buttons = row.querySelector('.approval-buttons');
      if (buttons) buttons.remove();
      const previewBtn = row.querySelector('.action-btn.preview');
      if (previewBtn) previewBtn.remove();
    } catch (err) {
      alert(err.message);
    }
  }

  async function rejectBlog(id) {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Lỗi khi từ chối bài viết');
      }

      alert('Đã xóa bài viết!');
      const blogRow = document.querySelector(`.blog-row[data-id="${id}"]`);
      if (blogRow) blogRow.remove();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  }

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

    document.querySelectorAll('.action-btn.preview').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.location.href = `/blog-read?post=${id}&preview=true`;
      });
    });
  }

  function filterAndRender() {
    const status = statusFilter.value;
    const subject = subjectFilter.value;
    const keyword = searchInput.value.toLowerCase();

    let filtered = [...allBlogs];

    if (status !== 'all') {
      const approved = status === 'approved';
      filtered = filtered.filter(blog => blog.approved === approved);
    }

    if (subject !== 'all') {
      if (subject === 'blog') {
        // Lọc ra các bài blog
      } else {
        // Lọc theo môn học cụ thể
        filtered = filtered.filter(blog => (blog.subject || '').toLowerCase() === subject);
      }
    }


    if (keyword.trim()) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(keyword) ||
        blog.content?.toLowerCase().includes(keyword)
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Không có tài liệu phù hợp</td></tr>';
    } else {
      tableBody.innerHTML = filtered.map((blog, i) => createRow(blog, i)).join('');
      addEventListeners();
    }
  }
  statusFilter.addEventListener('change', filterAndRender);
  subjectFilter.addEventListener('change', filterAndRender);
  searchInput.addEventListener('input', filterAndRender);

  loadBlogs();
});
