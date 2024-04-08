function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');

    window.location.href = 'index.html'; 
});



const menu = document.querySelector('#menu-bars');
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
    toggleOverlay();
    event.stopPropagation();
});

const overUser = document.querySelector('.overlay-user');

document.addEventListener('click', function (event) {
    const overlay = document.querySelector('.overlay');
    if (!overUser.contains(event.target) && overlay.style.display === 'block') {
        overlay.style.display = 'none';
    }
});

const pages = document.querySelector('.page-numbers')

pages.addEventListener('click', updateTableData);

async function updateTableData(e) {
    tableBody.innerHTML = ``;
    let page_no = e.target.textContent;
    let queryParam = `?page_no=${page_no}`;

    const response = await axios.get(`${baseUrl}/${queryParam}`, { headers: { 'Authorization': token } });

    updateData(response.data);

    
}

const createButton = (pageNumber,current) => {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.classList.add('page-number');

    if (pageNumber == current) button.classList.add('active');

    pages.appendChild(button);
}

function Pagination(data) {
    pages.innerHTML = ``;

    if (data.current > 1) createButton(1);
    if (data.current > 2) createButton(data.current - 1);

    createButton(data.current,data.current);

    if (data.current < data.lastPage - 1) createButton(data.current + 1);
    if (data.lastPage > data.current) {
        createButton(data.lastPage);
    }

   
}