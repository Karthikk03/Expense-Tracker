document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.fa-trash-alt').forEach(icon => {
        icon.setAttribute('data-bs-toggle', 'modal');
        icon.setAttribute('data-bs-target', '#target');
    });
})



let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar-menu');


menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

function toggleOverlay() {
    const overlay = document.querySelector('.overlay');
    if (overlay.style.display === 'none' || overlay.style.display === '') {
        overlay.style.display = 'block'; // Show the overlay
    }
}

document.querySelector('.fa-user').addEventListener('click', function(event) {
    event.stopPropagation();
    toggleOverlay();
});

document.addEventListener('click', function(event) {
    const overlay = document.querySelector('.overlay');
    if (overlay.style.display==='block') { 
        overlay.style.display = 'none';
    }
});





