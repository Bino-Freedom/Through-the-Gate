// Tải file loader HTML vào placeholder
$("#loader-container").load("html/placeholder/ploading-scene.html", function () {
    // Khi load xong file HTML loader thì bắt đầu theo dõi sự kiện load toàn trang
    $(window).on("load", function () {
        $(".loader").fadeOut("fast"); // Ẩn hiệu ứng loader
    });

    // Dự phòng: nếu có lỗi tải ảnh hay mạng chậm
    setTimeout(() => $(".loader").fadeOut("fast"), 8000);
});
