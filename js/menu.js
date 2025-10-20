// Hàm tải menu vào placeholder
function loadMenu() {
    const placeholder = document.getElementById('menu-placeholder');

    // Tạo XMLHttpRequest để tải menu.html
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'html/menu.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Chèn nội dung menu vào placeholder
            placeholder.innerHTML = xhr.responseText;

            // Khởi tạo menu sau khi đã tải
            initializeMenu();
        }
    };
    xhr.send();
}

// Hàm khởi tạo menu
function initializeMenu() {
    const menu = document.getElementById('main-menu');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('menu-overlay');

    // Xử lý sự kiện click nút toggle menu trên mobile/tablet
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            const isTablet = window.innerWidth >= 601 && window.innerWidth <= 1024;
            const isMobile = window.innerWidth <= 600;

            menu.classList.toggle('expanded');

            // Chỉ hiển thị overlay trên mobile
            if (isMobile) {
                overlay.classList.toggle('active');

                // Đóng menu khi click ra ngoài (chỉ trên mobile)
                if (menu.classList.contains('expanded')) {
                    overlay.addEventListener('click', closeMenu);
                    // Ngăn cuộn trang nền khi menu mở
                    document.body.style.overflow = 'hidden';
                } else {
                    overlay.removeEventListener('click', closeMenu);
                    document.body.style.overflow = '';
                }
            } else if (isTablet) {
                // Trên tablet, đảm bảo body có thể cuộn
                document.body.style.overflow = '';
            }
        });
    }

    // Hàm đóng menu
    function closeMenu() {
        menu.classList.remove('expanded');
        overlay.classList.remove('active');
        overlay.removeEventListener('click', closeMenu);
        document.body.style.overflow = '';
    }

    // Xử lý thay đổi kích thước màn hình
    window.addEventListener('resize', function () {
        // Đóng menu khi chuyển từ tablet/mobile sang PC
        if (window.innerWidth >= 1025) {
            closeMenu();
        }

        // Đóng menu khi chuyển giữa tablet và mobile
        if ((window.innerWidth <= 600 && window.innerWidth > 1024) ||
            (window.innerWidth >= 601 && window.innerWidth <= 1024)) {
            closeMenu();
        }
    });
}

// Tải menu khi trang đã tải xong
document.addEventListener('DOMContentLoaded', loadMenu);