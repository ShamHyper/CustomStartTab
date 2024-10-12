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
    });

    const savedStarColor = localStorage.getItem('starColor') || '#ffffff';
    const savedTopColor = localStorage.getItem('bgTopColor') || '#0e0e0e';
    const savedBottomColor = localStorage.getItem('bgBottomColor') || '#1b1b1b';

    document.getElementById('colorPicker').value = savedStarColor;
    document.getElementById('bgTopColor').value = savedTopColor;
    document.getElementById('bgBottomColor').value = savedBottomColor;
});