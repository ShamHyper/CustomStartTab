document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('applyColor').addEventListener('click', () => {
        const starColor = document.getElementById('colorPicker').value;
        const topColor = document.getElementById('bgTopColor').value;
        const bottomColor = document.getElementById('bgBottomColor').value;

        localStorage.setItem('starColor', starColor);
        localStorage.setItem('bgTopColor', topColor);
        localStorage.setItem('bgBottomColor', bottomColor);
        
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
        }

        chrome.runtime.sendMessage({ action: "reloadTab" }, (response) => {
            console.log(response.status);
        });
    });

    document.getElementById('restoreDefaults').addEventListener('click', () => {
        const defaultStarColor = '#ffffff';
        const defaultTopColor = '#0e0e0e';
        const defaultBottomColor = '#1b1b1b';

        localStorage.setItem('starColor', defaultStarColor);
        localStorage.setItem('bgTopColor', defaultTopColor);
        localStorage.setItem('bgBottomColor', defaultBottomColor);
        
        document.getElementById('colorPicker').value = defaultStarColor;
        document.getElementById('bgTopColor').value = defaultTopColor;
        document.getElementById('bgBottomColor').value = defaultBottomColor;

        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.background = `linear-gradient(to bottom, ${defaultTopColor}, ${defaultBottomColor})`;
        }

        document.getElementById('planetToggle').checked = false;
        localStorage.setItem('showPlanets', false);
        document.getElementById('starsToggle').checked = false;
        localStorage.setItem('showStars', false);
        document.getElementById('trailToggle').checked = false;
        localStorage.setItem('showTrail', false);
    });

    const savedStarColor = localStorage.getItem('starColor') || '#ffffff';
    const savedTopColor = localStorage.getItem('bgTopColor') || '#0e0e0e';
    const savedBottomColor = localStorage.getItem('bgBottomColor') || '#1b1b1b';

    document.getElementById('colorPicker').value = savedStarColor;
    document.getElementById('bgTopColor').value = savedTopColor;
    document.getElementById('bgBottomColor').value = savedBottomColor;

    const showPlanets = localStorage.getItem('showPlanets') === 'true';
    document.getElementById('planetToggle').checked = showPlanets;

    document.getElementById('planetToggle').addEventListener('change', (event) => {
        localStorage.setItem('showPlanets', event.target.checked);
    });

    const showStars = localStorage.getItem('showStars') === 'true';
    document.getElementById('starsToggle').checked = showStars;

    document.getElementById('starsToggle').addEventListener('change', (event) => {
        localStorage.setItem('showStars', event.target.checked);
    });

    const showTrail = localStorage.getItem('showTrail') === 'true';
    document.getElementById('trailToggle').checked = showTrail;

    document.getElementById('trailToggle').addEventListener('change', (event) => {
        localStorage.setItem('showTrail', event.target.checked);
    });
});