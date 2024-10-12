document.getElementById('applyColor').addEventListener('click', () => {
    const starColor = document.getElementById('colorPicker').value;
    const topColor = document.getElementById('bgTopColor').value;
    const bottomColor = document.getElementById('bgBottomColor').value;

    localStorage.setItem('starColor', starColor);
    localStorage.setItem('bgTopColor', topColor);
    localStorage.setItem('bgBottomColor', bottomColor);
    
    document.querySelector('canvas').style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
});