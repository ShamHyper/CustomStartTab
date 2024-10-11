console.log("Started custom tab")

const canvas = document.getElementById("starry-sky");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 100;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.5,
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(drawStars);
}

document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        search();
    }
});

document.getElementById('search-button').addEventListener('click', search);

const googleCheckbox = document.getElementById('google-checkbox');
const yandexCheckbox = document.getElementById('yandex-checkbox');
const duckduckgoCheckbox = document.getElementById('duckduckgo-checkbox');

function loadSearchOptions() {
    const searchEngine = localStorage.getItem('searchEngine');
    if (searchEngine === 'google') {
        googleCheckbox.checked = true;
    } else if (searchEngine === 'yandex') {
        yandexCheckbox.checked = true;
    } else if (searchEngine === 'duckduckgo') {
        duckduckgoCheckbox.checked = true;
    }
}

googleCheckbox.addEventListener('change', () => {
    if (googleCheckbox.checked) {
        yandexCheckbox.checked = false;
        duckduckgoCheckbox.checked = false;
        saveSearchOption('google');
    }
});
yandexCheckbox.addEventListener('change', () => {
    if (yandexCheckbox.checked) {
        googleCheckbox.checked = false;
        duckduckgoCheckbox.checked = false;
        saveSearchOption('yandex');
    }
});
duckduckgoCheckbox.addEventListener('change', () => {
    if (duckduckgoCheckbox.checked) {
        googleCheckbox.checked = false;
        yandexCheckbox.checked = false;
        saveSearchOption('duckduckgo');
    }
});

function saveSearchOption(engine) {
    localStorage.setItem('searchEngine', engine);
}

function search() {
    const query = document.getElementById('search-input').value;
    if (query) {
        let searchUrl;
        if (googleCheckbox.checked) {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else if (yandexCheckbox.checked) {
            searchUrl = `https://yandex.ru/search/?from=chromesearch&text=${encodeURIComponent(query)}`;
        } else if (duckduckgoCheckbox.checked) {
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        } else {
            alert('Choose search eng!');
            return;
        }
        window.open(searchUrl, '_blank');
    }
}

loadSearchOptions();

drawStars();