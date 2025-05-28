document.addEventListener("DOMContentLoaded", async () => {
  const blogListContainers = document.querySelectorAll(".blog-list");

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

  try {
    const res = await fetch('http://localhost:5000/api/blogs', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error("Không lấy được danh sách blog");

    const blogs = await res.json();

    console.log("Danh sách blog:", blogs);

    blogListContainers.forEach(container => container.innerHTML = "");

    function stripHTML(html) {
      const div = document.createElement("div");
      div.innerHTML = html;

      // Xóa tất cả các thẻ <img>
      const images = div.querySelectorAll("img");
      images.forEach(img => img.remove());

      return div.textContent || div.innerText || "";
    }

    function createBlogItem(blog) {
      const contentText = stripHTML(blog.content || "");
      if (!blog.content) {
        console.warn(`Blog thiếu content: ${blog._id}`);
      }

      // Xử lý thumbnail
      let image = "../assets/img-blog-1.webp"; // fallback nếu không có ảnh
      if (blog.thumbnailImage) {
        const direct = getDriveDirectLink(blog.thumbnailImage);
        image = proxyImageURL(direct); // hoặc dùng direct nếu không cần proxy
      }

      // Xử lý ngày tháng
      let date = "";
      if (blog.createdAt) {
        const parsedDate = new Date(blog.createdAt);
        if (!isNaN(parsedDate)) {
          date = parsedDate.toLocaleDateString("vi-VN");
        }
      }

      return `
        <a href="/blog-read?post=${blog._id}" class="blog-item">
          <img src="${image}" alt="Ảnh blog" class="blog-image" onerror="this.style.display='none'">
          <h3>${blog.title}</h3>
          <h6>${date}</h6>
          <p>${contentText.substring(0, 50)}...</p>
        </a>
      `;
    }

    if (blogs.length > 0) {
      const latestBlogs = [...blogs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      const mostViewedBlogs = [...blogs]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3);

      blogListContainers[0].innerHTML = latestBlogs.map(createBlogItem).join('');
      blogListContainers[1].innerHTML = mostViewedBlogs.map(createBlogItem).join('');
    }
  } catch (err) {
    console.error("Lỗi khi load blog:", err);
    blogListContainers.forEach(container => {
      container.innerHTML = `<p>Không thể tải bài viết. Vui lòng thử lại sau.</p>`;
    });
  }
});
