// /js/menuLoader.js
async function loadMenu() {
    try {
        const res = await fetch('/html/menu.html');
        const html = await res.text();
        document.getElementById('menu-placeholder').innerHTML = html;
    } catch (err) {
        console.error("Không thể tải menu:", err);
    }
}

// Gọi tự động khi trang tải
document.addEventListener("DOMContentLoaded", loadMenu);
