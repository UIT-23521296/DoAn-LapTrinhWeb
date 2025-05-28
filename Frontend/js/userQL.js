document.addEventListener("DOMContentLoaded", async () => {
  const blogListContainer = document.querySelector(".blog-list");

  // Chuyển link Google Drive thành link ảnh trực tiếp
  function getDriveDirectLink(url) {
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }

  // Nếu cần proxy qua server để tránh lỗi CORS
  function proxyImageURL(url) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }

  // Hàm loại bỏ thẻ img trong content
  function stripHTML(html) {
    const div = document.createElement("div");
    div.innerHTML = html;

    const images = div.querySelectorAll("img");
    images.forEach(img => img.remove());

    return div.textContent || div.innerText || "";
  }

  // Hàm tạo HTML cho từng blog, có thêm nút delete
  function createBlogItem(blog) {
    const contentText = stripHTML(blog.content || "");

    // Xử lý thumbnail từ Google Drive nếu có
    let image = "../assets/img-blog-1.webp";
    if (blog.thumbnailImage) {
      const direct = getDriveDirectLink(blog.thumbnailImage);
      image = proxyImageURL(direct); // hoặc chỉ dùng direct nếu không muốn proxy
    }

    let date = "";
    if (blog.createdAt) {
      const parsedDate = new Date(blog.createdAt);
      if (!isNaN(parsedDate)) {
        date = parsedDate.toLocaleDateString("vi-VN");
      }
    }

    return `
      <div class="blog-item" data-id="${blog._id}">
        <a href="/blog-read?post=${blog._id}" class="blog-link" style="text-decoration: none">
          <img src="${image}" alt="Thumbnail" class="blog-image" onerror="this.style.display='none'">
          <h3>${blog.title}</h3>
          <h6>${date}</h6>
          <p>${contentText.substring(0, 50)}...</p>
        </a>
        <button class="fas fa-trash delete-icon"></button>
      </div>
    `;
  }

  // Hàm load blog của user và render
  async function loadMyBlogs() {
    try {
      const res = await fetch('http://localhost:5000/api/blogs', { credentials: 'include' });
      if (!res.ok) throw new Error("Không lấy được danh sách blog");

      const blogs = await res.json();

      if (!Array.isArray(blogs)) {
        throw new Error("Dữ liệu blogs không hợp lệ");
      }

      if (blogs.length === 0) {
        blogListContainer.innerHTML = `<p>Bạn chưa đăng blog nào.</p>`;
        return;
      }

      blogListContainer.innerHTML = blogs.map(createBlogItem).join('');

      // Gắn sự kiện xóa cho từng nút
      document.querySelectorAll(".delete-icon").forEach(button => {
        button.addEventListener("click", async (e) => {
          const blogItem = e.target.closest(".blog-item");
          const blogId = blogItem.getAttribute("data-id");

          if (confirm("Bạn có chắc chắn muốn xóa blog này không?")) {
            try {
              const deleteRes = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
                method: 'DELETE',
                credentials: 'include'
              });
              if (!deleteRes.ok) {
                const errData = await deleteRes.json();
                alert("Xóa thất bại: " + (errData.msg || deleteRes.statusText));
                return;
              }

              alert("Xóa blog thành công!");
              // Tải lại danh sách blog sau khi xóa
              loadMyBlogs();
            } catch (err) {
              alert("Lỗi khi xóa blog: " + err.message);
            }
          }
        });
      });
    } catch (err) {
      console.error("Lỗi khi load blog người dùng:", err);
      blogListContainer.innerHTML = `<p>Không thể tải bài viết. Vui lòng thử lại sau.</p>`;
    }
  }

  // Gọi hàm load blog khi DOM ready
  loadMyBlogs();
});