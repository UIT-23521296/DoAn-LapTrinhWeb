async function fetchPendingDocuments() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/documents/pending', {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('HTTP error ' + response.status);

        const documents = await response.json();
        const tbody = document.getElementById('documents-tbody');
        tbody.innerHTML = ''; // xóa dữ liệu cũ

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
                <td>${doc.subject}</td>
                <td>
                    <span class="status-badge ${doc.status}">
                        ${doc.status === 'pending' ? 'Chờ duyệt' : doc.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
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

    } catch (error) {
        alert('Lỗi khi lấy dữ liệu: ' + error.message);
    }
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
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Lỗi khi duyệt tài liệu');

    const result = await response.json();
    alert(result.message || 'Đã duyệt tài liệu');

    // Tải lại danh sách sau khi duyệt
    fetchPendingDocuments();
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
        console.log('Response:', text);

        if (!response.ok) throw new Error(text || 'Từ chối tài liệu thất bại');

        const data = JSON.parse(text);
        alert(data.message || 'Đã từ chối tài liệu thành công');
        fetchPendingDocuments(); // hoặc location.reload()
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi từ chối tài liệu');
    });
}

window.onload = fetchPendingDocuments;
