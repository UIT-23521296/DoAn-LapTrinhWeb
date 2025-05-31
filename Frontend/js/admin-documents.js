document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử DOM
    const statusFilter = document.getElementById('filter-status');
    const subjectFilter = document.getElementById('filter-subject');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const tableRows = document.querySelectorAll('.documents-table tbody tr');

    // Hàm lọc tài liệu
    function filterDocuments() {
        const statusValue = statusFilter.value;
        const subjectValue = subjectFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            const statusCell = row.querySelector('.status-badge');
            const subjectCell = row.cells[4];
            const titleCell = row.querySelector('.document-title');
            const descCell = row.querySelector('.document-description');
            const authorCell = row.cells[2];

            const statusText = statusCell.textContent.toLowerCase();
            const subjectText = subjectCell.textContent.toLowerCase();
            const titleText = titleCell.textContent.toLowerCase();
            const descText = descCell.textContent.toLowerCase();
            const authorText = authorCell.textContent.toLowerCase();

            // Kiểm tra điều kiện filter
            const statusMatch = statusValue === 'all' ||
                (statusValue === 'pending' && statusText.includes('chờ')) ||
                (statusValue === 'approved' && statusText.includes('đã')) ||
                (statusValue === 'rejected' && statusText.includes('từ'));

            const subjectMatch = subjectValue === 'all' ||
                subjectText.toLowerCase().includes(subjectValue.toLowerCase());

            const searchMatch = searchValue === '' ||
                [titleText, descText, authorText, row.cells[0].textContent.toLowerCase()]
                    .some(text => text.includes(searchValue.toLowerCase()));
            // Hiển thị/ẩn row dựa trên kết quả filter
            if (statusMatch && subjectMatch && searchMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Thêm event listeners
    statusFilter.addEventListener('change', filterDocuments);
    subjectFilter.addEventListener('change', filterDocuments);
    searchInput.addEventListener('input', filterDocuments);
    searchButton.addEventListener('click', filterDocuments);

    // Xử lý các nút duyệt/từ chối
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge');

            statusBadge.textContent = 'Đã duyệt';
            statusBadge.className = 'status-badge approved';

            // Ẩn các nút duyệt/từ chối sau khi xử lý
            const approvalButtons = row.querySelector('.approval-buttons');
            if (approvalButtons) {
                approvalButtons.style.display = 'none';
            }

            // Có thể thêm AJAX call để lưu trạng thái vào server
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge');

            statusBadge.textContent = 'Từ chối';
            statusBadge.className = 'status-badge rejected';

            // Ẩn các nút duyệt/từ chối sau khi xử lý
            const approvalButtons = row.querySelector('.approval-buttons');
            if (approvalButtons) {
                approvalButtons.style.display = 'none';
            }

            // Có thể thêm AJAX call để lưu trạng thái vào server
        });
    });

    // Xử lý nút xem tài liệu
    document.querySelectorAll('.action-btn.preview').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const docId = row.cells[0].textContent;
            const docTitle = row.querySelector('.document-title').textContent;

            // Mở modal hoặc chuyển hướng đến trang xem chi tiết
            alert(`Xem tài liệu: ${docTitle} (ID: ${docId})`);
            // window.location.href = `/document/${docId}`;
        });
    });
});