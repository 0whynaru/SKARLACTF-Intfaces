const intro = document.getElementById('intro');
const main  = document.getElementById('main');

function masuk() {
intro.classList.add('fade-out');
setTimeout(() => {
    intro.style.display = 'none';
    main.classList.add('visible');
}, 1350);
}

// otomatis masuk setelah 4.5 detik, atau klik/tap intro untuk skip
setTimeout(masuk, 4500);
intro.addEventListener('click', masuk);

['keydown', 'keyup'].forEach(eventType => {
    document.addEventListener(eventType, function(event) {
        // Cek Ctrl+U atau F12
        if ((event.ctrlKey && event.key === 'u') || event.key === 'F12') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });
});


