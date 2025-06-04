document.addEventListener('DOMContentLoaded', async () => {
  // Cập nhật thống kê từ API
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();

    document.getElementById('total-documents').textContent = data.total;
    document.getElementById('total-users').textContent = data.totalUsers;
    document.getElementById('pending-docs').textContent = data.pending;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  // --- Phần load và render blog ---
  const tableBody = document.querySelector('.table-container table tbody');
  const paginationContainer = document.querySelector('.pagination');
  const pageNumbersContainer = document.querySelector('.page-numbers');
  const prevBtn = document.querySelector('.page-btn.prev');
  const nextBtn = document.querySelector('.page-btn.next');

  let allItems = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  
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

  function createRow(item) {
    const isApproved = item.approved === true; 
    let subjectName = '';
    if(item.type === 'blog') {
      subjectName = 'Blog'; // hoặc item.subject nếu có
    } else if(item.type === 'document') {
      subjectName = item.subject || 'Tài liệu';
    }

    return `
      <tr data-id="${item._id}" data-type="${item.type}">
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.author || item.uploader || '')}</td>
        <td>${formatDate(item.createdAt || item.uploadDate)}</td>
        <td>${escapeHtml(subjectName)}</td>
        <td>
          <span class="status ${isApproved ? 'approved' : 'pending'}">
            ${isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
          </span>
        </td>
        <td>
          <button class="action-btn view" data-id="${item._id}" data-type="${item.type}" title="Xem"><i class="fas fa-eye"></i></button>
          <button class="action-btn delete" data-id="${item._id}" data-type="${item.type}" title="Xóa"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }

  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToRender = allItems.slice(start, end);

    if (itemsToRender.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có tài liệu</td></tr>';
    } else {
      tableBody.innerHTML = itemsToRender.map(createRow).join('');
    }

    addEventListeners();
  }

  function renderPagination() {
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderTable();
        renderPagination();
      });
      pageNumbersContainer.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  async function loadItems() {
    try {
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
      const data = await res.json();

      const { approvedItems = [], pendingItems = [] } = data;
      allItems = [...pendingItems, ...approvedItems];

      if (allItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có tài liệu</td></tr>';
        paginationContainer.style.display = 'none';
      } else {
        paginationContainer.style.display = 'flex';
        currentPage = 1;
        renderTable();
        renderPagination();
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
      loadItems();
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
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  });
  loadItems();
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
