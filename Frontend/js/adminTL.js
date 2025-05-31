// Hàm lấy tài liệu theo trạng thái và render
async function fetchDocumentsByStatus(status = 'pending') {
  try {
    const validStatuses = ['all', 'pending', 'approved'];
    if (!validStatuses.includes(status)) status = 'pending';

    let url = 'http://localhost:5000/api/admin/documents';
    if (status !== 'all') {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('HTTP error ' + response.status);

    const documents = await response.json();
    renderDocuments(documents);
  } catch (error) {
    alert('Lỗi khi lấy dữ liệu: ' + error.message);
  }
}

// Hàm render bảng tài liệu
function renderDocuments(documents) {
  const tbody = document.getElementById('documents-tbody');
  tbody.innerHTML = '';

  documents.forEach((doc, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="document-info">
          <div class="document-title">${doc.title}</div>
          <div class="document-description">${doc.description || ''}</div>
        </div>
      </td>
      <td>${doc.uploader}</td>
      <td>${new Date(doc.uploadDate).toLocaleDateString('vi-VN')}</td>
      <td>${doc.subjectName}</td>
      <td>
        <span class="status-badge ${doc.status}">
          ${doc.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
        </span>
      </td>
      <td>
        <!-- Nút Xem luôn hiển thị -->
        <button class="action-btn preview" onclick="previewDocument('${doc.fileUrl}')">
          <i class="fas fa-eye"></i> Xem
        </button>
        <button class="approve-btn" onclick="approveDocument('${doc._id}')">
          <i class="fas fa-check"></i>
        </button>
        <button class="reject-btn" onclick="rejectDocument('${doc._id}')">
          <i class="fas fa-times"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}
// Mở file trong tab mới
function previewDocument(fileUrl) {
  // Chuẩn hóa dấu gạch chéo nếu cần
  const url = fileUrl.replace(/\\/g, '/');
  window.open(url, '_blank');
}

// Duyệt tài liệu
async function approveDocument(id) {
  if (!confirm('Bạn có chắc chắn muốn duyệt tài liệu này?')) return;
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/documents/approve/\${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if (!response.ok) throw new Error('Lỗi khi duyệt tài liệu');
    const result = await response.json();
    alert(result.message || 'Đã duyệt tài liệu');
    // Làm mới danh sách
    const filter = document.getElementById('filter-status');
    fetchDocumentsByStatus(filter.value);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

// Từ chối tài liệu
async function rejectDocument(id) {
  if (!confirm('Bạn có chắc muốn từ chối tài liệu này?')) return;
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/documents/reject/\${id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Từ chối tài liệu thất bại');
    }
    const data = await response.json();
    alert(data.message || 'Đã từ chối tài liệu thành công');
    const filter = document.getElementById('filter-status');
    fetchDocumentsByStatus(filter.value);
  } catch (error) {
    alert('Có lỗi xảy ra khi từ chối tài liệu');
    console.error('Lỗi:', error);
  }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  const filter = document.getElementById('filter-status');
  if (!filter) {
    console.error('Không tìm thấy dropdown!');
    return;
  }

  // Gọi lần đầu
  fetchDocumentsByStatus(filter.value);
  // Gắn listener 1 lần
  filter.addEventListener('change', () => {
    fetchDocumentsByStatus(filter.value);
  });
});
