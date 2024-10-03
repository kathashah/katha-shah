const bluebtn = document.querySelectorAll('.btn-primary');
bluebtn.forEach(button => {
    button.onmousemove = (e) => {
        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left; // Calculate x position
        const y = e.clientY - rect.top;  // Calculate y position
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    };
});

const lightbtn =  document.getElementById('turn_on');
lightbtn.addEventListener('mouseenter', () =>{
    lightbtn.textContent = 'Lumos Maxima';
});

lightbtn.addEventListener('mouseleave', () => {
    lightbtn.textContent = 'Turn on the Lights!';
});