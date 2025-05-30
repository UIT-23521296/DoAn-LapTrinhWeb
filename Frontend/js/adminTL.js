async function fetchDocumentsByStatus(status = 'pending') {
  try {
    // Chỉ lấy trạng thái pending hoặc approved
    // Nếu status rỗng, lấy pending (hoặc bạn có thể sửa backend cho lấy tất cả ngoại trừ rejected)
    const validStatuses = ['all','pending', 'approved'];
    if (!validStatuses.includes(status)) status = 'pending';

    const url = `http://localhost:5000/api/admin/documents?status=${status}`;

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

function renderDocuments(documents) {
  const tbody = document.getElementById('documents-tbody');
  tbody.innerHTML = '';

  documents.forEach((doc, index) => {
    const tr = document.createElement('tr');
    const isApproved = doc.status === 'approved';

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
          <div class="document-info">
              <div class="document-title">${doc.title}</div>
              <div class="document-description">${doc.description || ''}</div>
          </div>
      </td>
      <td>${doc.uploader}</td>
      <td>${new Date(doc.uploadDate).toLocaleDateString()}</td>
      <td>${doc.subjectName}</td>
      <td>
          <span class="status-badge ${doc.status}">
              ${doc.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
          </span>
      </td>
      <td>
          ${isApproved ? `
              <button class="action-btn preview" onclick="previewDocument('${doc.fileUrl}')">
                  <i class="fas fa-eye"></i> Xem
              </button>
          ` : ''}
          <div class="approval-buttons">
              <button class="approve-btn" onclick="approveDocument('${doc._id}')"><i class="fas fa-check"></i></button>
              <button class="reject-btn" onclick="rejectDocument('${doc._id}', '${doc.fileUrl}')"><i class="fas fa-times"></i></button>
          </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function previewDocument(fileUrl) {
  const url = 'http://localhost:5000/' + fileUrl.replace(/\\/g, '/');
  window.open(url, '_blank');
}

async function approveDocument(id) {
  if (!confirm('Bạn có chắc chắn muốn duyệt tài liệu này?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/admin/documents/approve/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Lỗi khi duyệt tài liệu');

    const result = await response.json();
    alert(result.message || 'Đã duyệt tài liệu');

    fetchDocumentsByStatus(document.getElementById('filter-status').value);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

function rejectDocument(id, fileUrl) {
  if (!confirm('Bạn có chắc muốn từ chối tài liệu này?')) return;

  fetch(`http://localhost:5000/api/admin/documents/reject/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(async response => {
      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Từ chối tài liệu thất bại');

      const data = JSON.parse(text);
      alert(data.message || 'Đã từ chối tài liệu thành công');
      fetchDocumentsByStatus(document.getElementById('filter-status').value);
    })
    .catch(error => {
      alert('Có lỗi xảy ra khi từ chối tài liệu');
      console.error('Lỗi:', error);
    });
}

// Lắng nghe sự kiện thay đổi dropdown lọc trạng thái
document.addEventListener('DOMContentLoaded', () => {
  const filter = document.getElementById('filter-status');
  console.log('Dropdown:', filter);

  if (!filter) {
    console.error('Không tìm thấy dropdown!');
    return;
  }

  filter.addEventListener('change', () => {
    console.log('Filter changed:', filter.value);
    // Gọi hàm fetch tài liệu theo trạng thái mới
    fetchDocumentsByStatus(filter.value);
  });
});

window.onload = () => {
  fetchDocumentsByStatus('pending');

  const filter = document.getElementById('filter-status');
  if (filter) {
    filter.addEventListener('change', () => {
      console.log('Filter changed:', filter.value);
      fetchDocumentsByStatus(filter.value);
    });
  }
};
