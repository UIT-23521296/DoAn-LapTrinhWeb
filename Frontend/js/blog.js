document.addEventListener("DOMContentLoaded", async () => {
    const blogListContainers = document.querySelectorAll(".blog-list");

    // Gọi API lấy danh sách blog
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      if (!res.ok) throw new Error("Không lấy được danh sách blog");

      const blogs = await res.json();

      console.log("Danh sách blog:", blogs);


      // Xóa nội dung mẫu cũ
      blogListContainers.forEach(container => container.innerHTML = "");

      // Hàm loại bỏ thẻ HTML từ content
      function stripHTML(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
      }

      // Hàm tạo item blog HTML
      function createBlogItem(blog) {
        const contentText = stripHTML(blog.content || "");
        const image = blog.image || "../assets/img-blog-2.webp";
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
            <p>${contentText.substring(0, 100)}...</p>
          </a>
        `;
      }

      if (blogs.length > 0) {
        const latestBlogs = [...blogs]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        const mostViewedBlogs = [...blogs]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);

        // Gắn nội dung vào các container
        blogListContainers[0].innerHTML = latestBlogs.map(createBlogItem).join('');
        blogListContainers[1].innerHTML = mostViewedBlogs.map(createBlogItem).join('');
        blogListContainers[2].innerHTML = blogs.map(createBlogItem).join('');
      }
    } catch (err) {
      console.error("Lỗi khi load blog:", err);
      blogListContainers.forEach(container => {
        container.innerHTML = `<p>Không thể tải bài viết. Vui lòng thử lại sau.</p>`;
      });
    }
});
