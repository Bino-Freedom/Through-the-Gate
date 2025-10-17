async function loadPage() {
    try {
        // 1. Tải danh sách nhân vật
        const jsonRes = await fetch('../data/enemyList.json');
        const data = await jsonRes.json();

        // 2. Xác định khu vực danh sách
        const listContainer = document.querySelector('.enemy-list-box');
        if (!listContainer) return console.error('Không tìm thấy .enemy-list-box');

        // 3. Xóa nội dung cũ
        listContainer.innerHTML = '';

        // 4. Duyệt qua danh sách
        data.forEach(char => {
            if (!char.linkTemplate || !char.charName) return;

            const charNameLower = char.charName.toLowerCase();

            // Tạo phần tử <a>
            const link = document.createElement('a');
            link.classList.add('enemy-box');
            link.href = `${char.linkTemplate}?char=${encodeURIComponent(charNameLower)}`;

            // Ảnh
            const img = document.createElement('img');
            img.src = char.cardImg || '../image/characters/sample/placeholder.png';
            img.alt = char.charName;
            link.appendChild(img);

            // Gạch ngang
            const hr = document.createElement('hr');
            link.appendChild(hr);

            // Tên
            const name = document.createElement('p');
            name.classList.add('enemy-name');
            name.textContent = char.charName;
            link.appendChild(name);

            // Thêm vào danh sách
            listContainer.appendChild(link);
        });
    } catch (err) {
        console.error('Lỗi khi tải danh sách nhân vật:', err);
    }
}

// 5. Gọi khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', loadPage);
