function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

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

document.querySelector('.fa-user').addEventListener('click', function (event) {
    event.stopPropagation();
    toggleOverlay();
});

document.addEventListener('click', function (event) {
    const overlay = document.querySelector('.overlay');
    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
    }
});