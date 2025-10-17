document.addEventListener("DOMContentLoaded", () => {
    let lastScrollY = window.scrollY;

    function getScrollDirection() {
        const direction = window.scrollY > lastScrollY ? "down" : "up";
        lastScrollY = window.scrollY;
        return direction;
    }

    // Lấy tất cả phần tử fade + tất cả con của parent-fade
    const fadeElements = Array.from(document.querySelectorAll(".fade"));
    const parentChildren = Array.from(document.querySelectorAll(".parent-fade *"));
    const allElements = Array.from(new Set([...fadeElements, ...parentChildren]));

    // Khởi tạo style ban đầu
    allElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        el.dataset.initial = "true"; // đánh dấu
    });

    const observer = new IntersectionObserver((entries) => {
        const direction = getScrollDirection();
        entries.forEach((entry, index) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                // Khi vào viewport
                const offsetY = direction === "down" ? 20 : -20;
                el.style.transform = `translateY(${offsetY}px)`;
                requestAnimationFrame(() => {
                    el.style.opacity = 1;
                    el.style.transform = "translateY(0)";
                });
                if (el.closest(".parent-fade")) {
                    el.style.transitionDelay = index * 0.1 + "s";
                }
            } else {
                // Khi ra khỏi viewport → reset
                el.style.opacity = 0;
                el.style.transform = "translateY(20px)";
                if (el.closest(".parent-fade")) {
                    el.style.transitionDelay = "0s";
                }
            }
        });
    }, { threshold: 0.1 });

    allElements.forEach(el => observer.observe(el));
});
