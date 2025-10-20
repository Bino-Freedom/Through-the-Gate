// Đầu tiên, load loader.html vào trang
$(document).ready(function () {
    $("#loader-placeholder").load("html/loading.html", function () {
        // Khi loader đã chèn xong, bắt đầu tính % load
        startLoadingProgress();
    });
});

function startLoadingProgress() {
    const resources = [
        'images/bg.jpg',
        'images/char1.png',
        'images/char2.png',
        'videos/intro.mp4',
        'spine/anim1.json',
        'spine/anim2.json'
    ];

    let loadedCount = 0;
    const total = resources.length;

    function resourceLoaded() {
        loadedCount++;
        const percent = Math.round((loadedCount / total) * 100);
        $('.progress-text').text(percent + '%');
        if (loadedCount === total) {
            $('.loader').fadeOut(300);
        }
    }

    // Load ảnh
    resources.filter(r => /\.(png|jpg|jpeg|gif)$/i.test(r)).forEach(src => {
        const img = new Image();
        img.onload = resourceLoaded;
        img.onerror = resourceLoaded;
        img.src = src;
    });

    // Load video
    resources.filter(r => /\.mp4$/i.test(r)).forEach(src => {
        const video = document.createElement('video');
        video.onloadeddata = resourceLoaded;
        video.onerror = resourceLoaded;
        video.src = src;
    });

    // Load JSON (spine)
    resources.filter(r => /\.json$/i.test(r)).forEach(src => {
        fetch(src)
            .then(() => resourceLoaded())
            .catch(() => resourceLoaded());
    });
}
