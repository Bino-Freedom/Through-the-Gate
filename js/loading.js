const loadingBtns = document.querySelectorAll(".loading-btn");
const loading = document.getElementById("loading-scene");
const mainContent = document.getElementById("main-content");

// Lưu lại scroll position trước khi loading
let scrollPosition = 0;

// Hàm khóa cuộn
function lockScroll() {
    scrollPosition = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
}

// Hàm mở lại cuộn
function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
}

loadingBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault(); // ngăn link chuyển ngay

        // Khóa cuộn
        lockScroll();

        // Hiển thị loading
        loading.style.display = "flex";
        loading.style.opacity = "1";

        // Giữ loading ít nhất 1 giây
        setTimeout(() => {
            loading.style.opacity = "0";
            setTimeout(() => {
                loading.style.display = "none";
                mainContent.style.display = "block";

                // Mở lại cuộn
                unlockScroll();

                // **Bắt đầu fade effects sau khi loading tắt**
                startFadeEffects();

            }, 400); // khớp với transition opacity
        }, 1000);
    });
});
