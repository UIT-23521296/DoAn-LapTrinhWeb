document.addEventListener("DOMContentLoaded", async () => {
    const blogListContainers = document.querySelectorAll(".blog-list");

    try {
      const res = await fetch('http://localhost:5000/api/blogs');
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
        // Lấy thumbnailImage thay cho ảnh cũ
        const image = blog.thumbnailImage || "../assets/img-blog-1.webp";

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
            <img src="${image}" alt="" class="blog-image">
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
