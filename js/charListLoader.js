async function loadPage() {
    // 1. Tải danh sách nhân vật
    const jsonRes = await fetch('../data/characterList.json');
    const data = await jsonRes.json();

    // 2. Xác định khu vực danh sách
    const listContainer = document.querySelector('.char-list');

    // 3. Xóa phần template cũ (nếu có)
    listContainer.innerHTML = '';

    // 4. Duyệt qua từng nhân vật và tạo phần tử
    data.forEach(char => {
        if (!char.linkTemplate || !char.charName) return;

        // Chuyển charName về chữ thường
        const charNameLower = char.charName.toLowerCase();

        // Tạo đường dẫn có query string (chữ thường)
        // VD: /html/characters/template.html?char=nightmare
        const link = document.createElement('a');
        link.href = `${char.linkTemplate}?char=${encodeURIComponent(charNameLower)}`;

        // Tạo nút nhân vật
        const button = document.createElement('button');
        button.className = 'char-card';

        // Ảnh
        const img = document.createElement('img');
        img.src = char.cardImg || '';
        button.appendChild(img);

        // Tên
        const nameDiv = document.createElement('div');
        nameDiv.className = 'char-name-card';
        const nameP = document.createElement('p');
        nameP.textContent = char.charName || 'Unknown';
        nameDiv.appendChild(nameP);

        button.appendChild(nameDiv);
        link.appendChild(button);

        // 🔹 Thêm vào danh sách
        listContainer.appendChild(link);
    });
}

// 5. Gọi sau khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', loadPage);
