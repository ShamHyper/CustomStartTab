document.addEventListener('DOMContentLoaded', () => {
    function rgbFromInputs(rInput, gInput, bInput) {
        const r = parseInt(rInput.value) || 0;
        const g = parseInt(gInput.value) || 0;
        const b = parseInt(bInput.value) || 0;
        return `rgb(${r}, ${g}, ${b})`;
    }

    function setInputsFromRgb(rgbString, rInput, gInput, bInput) {
        const rgb = rgbString.match(/\d+/g);
        if (rgb) {
            rInput.value = rgb[0];
            gInput.value = rgb[1];
            bInput.value = rgb[2];
        }
    }

    document.getElementById('applyColor').addEventListener('click', () => {
        const starColor = rgbFromInputs(document.getElementById('starR'), document.getElementById('starG'), document.getElementById('starB'));
        const topColor = rgbFromInputs(document.getElementById('topR'), document.getElementById('topG'), document.getElementById('topB'));
        const bottomColor = rgbFromInputs(document.getElementById('bottomR'), document.getElementById('bottomG'), document.getElementById('bottomB'));

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
        const defaultStarColor = 'rgb(255, 255, 255)';
        const defaultTopColor = 'rgb(14, 14, 14)';
        const defaultBottomColor = 'rgb(27, 27, 27)';

        localStorage.setItem('starColor', defaultStarColor);
        localStorage.setItem('bgTopColor', defaultTopColor);
        localStorage.setItem('bgBottomColor', defaultBottomColor);

        setInputsFromRgb(defaultStarColor, document.getElementById('starR'), document.getElementById('starG'), document.getElementById('starB'));
        setInputsFromRgb(defaultTopColor, document.getElementById('topR'), document.getElementById('topG'), document.getElementById('topB'));
        setInputsFromRgb(defaultBottomColor, document.getElementById('bottomR'), document.getElementById('bottomG'), document.getElementById('bottomB'));

        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.background = `linear-gradient(to bottom, ${defaultTopColor}, ${defaultBottomColor})`;
        }

        document.getElementById('planetToggle').checked = false;
        localStorage.setItem('showPlanets', false);
        document.getElementById('starsToggle').checked = false;
        localStorage.setItem('showStars', false);
    });

    const savedStarColor = localStorage.getItem('starColor') || 'rgb(255, 255, 255)';
    const savedTopColor = localStorage.getItem('bgTopColor') || 'rgb(14, 14, 14)';
    const savedBottomColor = localStorage.getItem('bgBottomColor') || 'rgb(27, 27, 27)';

    setInputsFromRgb(savedStarColor, document.getElementById('starR'), document.getElementById('starG'), document.getElementById('starB'));
    setInputsFromRgb(savedTopColor, document.getElementById('topR'), document.getElementById('topG'), document.getElementById('topB'));
    setInputsFromRgb(savedBottomColor, document.getElementById('bottomR'), document.getElementById('bottomG'), document.getElementById('bottomB'));

    const showPlanets = localStorage.getItem('showPlanets') === 'true';
    document.getElementById('planetToggle').checked = showPlanets;

    document.getElementById('planetToggle').addEventListener('change', (event) => {
        localStorage.setItem('showPlanets', event.target.checked);
        localStorage.setItem('showPlanets', event.target.checked);
    });

    const showStars = localStorage.getItem('showStars') === 'true';
    document.getElementById('starsToggle').checked = showStars;

    document.getElementById('starsToggle').addEventListener('change', (event) => {
        localStorage.setItem('showStars', event.target.checked);
    });
});
