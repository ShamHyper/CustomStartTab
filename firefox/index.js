console.log("Started custom tab");

const canvas = document.getElementById("starry-sky");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

const stars = [];
const numStars = 100;

const planets = [];
const numPlanets = 5;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 1 + 0.5,
    });
}

for (let i = 0; i < numPlanets; i++) {
    planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 15,
        speed: Math.random() * 0.5 + 0.1,
        color: `hsl(${Math.random() * 360}, 15%, 70%)` // planets color britness
    });
}

function drawStarsAndPlanets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const starColor = localStorage.getItem('starColor') || 'white';
    const fadeStartHeight = canvas.height * 0.9;

    stars.forEach((star) => {
        let fadeOutFactor = 1;

        if (star.y > fadeStartHeight) {
            fadeOutFactor = Math.max(0, 1 - ((star.y - fadeStartHeight) / (canvas.height - fadeStartHeight)));
        }

        ctx.globalAlpha = fadeOutFactor;
        ctx.fillStyle = starColor;
        ctx.shadowBlur = 5;
        ctx.shadowColor = starColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = -star.radius;
            star.x = Math.random() * canvas.width;
        }
    });

    const showPlanets = localStorage.getItem('showPlanets') != 'true';
    if (showPlanets) {
        planets.forEach((planet) => {
            let fadeOutFactor = 1;

            if (planet.y > fadeStartHeight) {
                fadeOutFactor = Math.max(0, 1 - ((planet.y - fadeStartHeight) / (canvas.height - fadeStartHeight)));
            }

            ctx.globalAlpha = fadeOutFactor;
            ctx.fillStyle = planet.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = planet.color;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
            ctx.fill();

            planet.y += planet.speed;
            if (planet.y > canvas.height) {
                planet.y = -planet.radius * 2;
                planet.x = Math.random() * canvas.width;
            }
        });
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(drawStarsAndPlanets);
}

function applyBackgroundColors() {
    const topColor = localStorage.getItem('bgTopColor') || '#0e0e0e';
    const bottomColor = localStorage.getItem('bgBottomColor') || '#1b1b1b';
    canvas.style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
}

applyBackgroundColors();

window.addEventListener('resize', debounce(resizeCanvas, 200));

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

function handleSearch(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        search();
    }
}

document.getElementById('search-input').addEventListener('keypress', handleSearch);
document.getElementById('search-button').addEventListener('click', handleSearch);

const checkboxes = {
    google: document.getElementById('google-checkbox'),
    yandex: document.getElementById('yandex-checkbox'),
    duckduckgo: document.getElementById('duckduckgo-checkbox'),
    perplexity: document.getElementById('perplexity-checkbox')
};

function loadSearchOptions() {
    const searchEngine = localStorage.getItem('searchEngine') || 'google';
    checkboxes[searchEngine].checked = true;
}

Object.keys(checkboxes).forEach(engine => {
    checkboxes[engine].addEventListener('change', () => handleCheckboxChange(engine));
});

function handleCheckboxChange(engine) {
    if (checkboxes[engine].checked) {
        Object.keys(checkboxes).forEach(otherEngine => {
            if (otherEngine !== engine) {
                checkboxes[otherEngine].checked = false;
            }
        });
        saveSearchOption(engine);
    }
}

function saveSearchOption(engine) {
    localStorage.setItem('searchEngine', engine);
}

document.addEventListener('DOMContentLoaded', loadSearchOptions);

function search() {
    const query = document.getElementById('search-input').value;
    if (query) {
        let searchUrl;
        if (checkboxes.google.checked) {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else if (checkboxes.yandex.checked) {
            searchUrl = `https://yandex.ru/search/?from=chromesearch&text=${encodeURIComponent(query)}`;
        } else if (checkboxes.duckduckgo.checked) {
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        } else if (checkboxes.perplexity.checked) {
            searchUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(query)}`;
        } else {
            alert('Choose search engine!');
            return;
        }
        window.open(searchUrl, '_blank');
    }
}

function cacheData(key, data, expiration) {
    const cache = {
        data,
        expiration: Date.now() + expiration
    };
    localStorage.setItem(key, JSON.stringify(cache));
}

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (cached) {
        const cache = JSON.parse(cached);
        if (Date.now() < cache.expiration) {
            console.log(`[CACHE] ${key} retrieved from cache`);
            return cache.data;
        } else {
            localStorage.removeItem(key);
        }
    }
    return null;
}

async function getWeather() {
    console.log("Starting getWeather")
    const cacheKey = 'weather';
    const cachedWeather = getCachedData(cacheKey);
    
    if (cachedWeather) {
        document.getElementById('weather-info').innerText = cachedWeather;
        return;
    }

    if (navigator.geolocation) {
        console.log("Starting navigator")
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherData(latitude, longitude);
        }, () => {
            document.getElementById('weather-info').innerText = 'Unable to retrieve location.';
        });
    } else {
        document.getElementById('weather-info').innerText = 'Geolocation is not supported by this browser.';
    }
}

async function fetchWeatherData(lat, lon) {
    const cacheKey = 'geocodeResponse';
    const cachedGeocode = getCachedData(cacheKey);
    
    if (cachedGeocode) {
        updateWeatherDisplay(cachedGeocode.city, cachedGeocode.weather);
        if (!getCachedData('weather')) {
            await updateWeatherData(lat, lon, cachedGeocode.city);
        }
        return;
    }

    try {
        console.log("Fetching geocode");
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
        const geocodeData = await geocodeResponse.json();
        const city = geocodeData.address.city || geocodeData.address.town || geocodeData.address.village || 'Unknown location';

        await updateWeatherData(lat, lon, city);
    } catch {
        document.getElementById('weather-info').innerText = 'Error retrieving weather.';
    }
    console.log("Weather widget loaded");
}

async function updateWeatherData(lat, lon, city) {
    try {
        const weatherResponse = await fetch(`https://wttr.in/${city}?format=%C+%t&lang=en`);
        const weatherData = await weatherResponse.text();
        updateWeatherDisplay(city, weatherData);
        cacheData('geocodeResponse', { city, weather: weatherData }, 3600000);
        cacheData('weather', `${city} | ${weatherData}`, 60000);
    } catch {
        document.getElementById('weather-info').innerText = 'Error retrieving weather.';
    }
}

function updateWeatherDisplay(city, weather) {
    const weatherText = `${city} | ${weather}`;
    document.getElementById('weather-info').innerText = weatherText;
}

async function getCurrencyRates() {
    const cachedRates = getCachedData('currencyRates');
    if (cachedRates) {
        document.getElementById('currency-info').innerText = cachedRates;
        return;
    }

    try {
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,the-open-network&vs_currencies=usd');
        const cryptoData = await cryptoResponse.json();

        const btcRate = cryptoData.bitcoin?.usd || 'N/A';
        const ethRate = cryptoData.ethereum?.usd || 'N/A';
        const tonRate = cryptoData['the-open-network']?.usd || 'N/A';

        const ratesText = `BTC: $${btcRate} | ETH: $${ethRate} | TON: $${tonRate}`;
        document.getElementById('currency-info').innerText = ratesText;
        cacheData('currencyRates', ratesText, 300000);
    } catch {
        document.getElementById('currency-info').innerText = 'Error retrieving currency rates.';
    }
    console.log("Currency widget loaded")
}

function updateTime() {
    const now = new Date();
    const timeText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const dateText = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    document.getElementById('time-display').innerText = timeText;
    document.getElementById('date-display').innerText = dateText;
}

fetch('manifest.json')
    .then(response => response.json())
    .then(data => {
        const version = data.version;
        document.getElementById('footer-version').textContent = `CustomStartTab | v${version} | Made by ShamHyper `;
    })
    .catch(() => {
        document.getElementById('footer-version').textContent = 'CustomStartTab | Made by ShamHyper';
    });

setInterval(updateTime, 1000);
updateTime();
getWeather();
getCurrencyRates();
loadSearchOptions();
drawStarsAndPlanets();