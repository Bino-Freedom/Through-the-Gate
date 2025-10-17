// /js/menuLoader.js
async function loadMenu() {
    try {
        // Xác định folder gốc của Project Page
        const projectRoot = "/Through-the-Gate/";

        // Lấy menu.html từ folder /html/
        const res = await fetch(projectRoot + "html/menu.html");
        const html = await res.text();

        document.getElementById('menu-placeholder').innerHTML = html;
    } catch (err) {
        console.error("Không thể tải menu:", err);
    }
}

// Gọi tự động khi trang tải
document.addEventListener("DOMContentLoaded", loadMenu);