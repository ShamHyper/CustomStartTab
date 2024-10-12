document.getElementById('applyColor').addEventListener('click', () => {
    const selectedColor = document.getElementById('colorPicker').value;
    localStorage.setItem('starColor', selectedColor);
});