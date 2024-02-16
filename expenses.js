const token = localStorage.getItem('token');
let expesneId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const response = await axios.get(`http://localhost:3000/expenses`, { headers: { 'Authorization': token } });

    response.data.forEach(item => {
        addRow(item);
    })

})

let form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', addExpense);

async function addExpense(e) {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const amount = document.getElementById('money').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('desc').value;

    const expenseData = {
        category,
        amount,
        date,
        description
    };

    const response = await axios.post(`http://localhost:3000/expenses/add-expense`, expenseData, { headers: { 'Authorization': token } });
    form.reset();
    addRow(response.data);

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

function addRow(expense) {
    const { category, amount, date, description } = expense;

    const tableBody = document.getElementById('table-data');

    const newRow = document.createElement('tr');
    newRow.setAttribute('id', expense.id);

    const descCell = document.createElement('td');
    descCell.classList.add('category', category);

    const categoryCell = document.createElement('td');
    const dateCell = document.createElement('td');
    const amountCell = document.createElement('td');

    const actionCell = document.createElement('td');
    actionCell.innerHTML = '<i class="fas fa-edit"></i> <i class="fas fa-trash-alt" data-bs-toggle="modal" data-bs-target="#target"></i> ';

    descCell.textContent = description;
    dateCell.textContent = date;
    amountCell.textContent = '$ ' + amount;
    categoryCell.textContent = category;

    // Append cells to the row
    newRow.appendChild(descCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(amountCell);
    newRow.appendChild(actionCell);



    // Append the row to the table body
    tableBody.appendChild(newRow);

    actionCell.addEventListener('click', async (e) => {
        if (e.target.classList.contains('fa-trash-alt')) {
            expesneId = e.target.closest('tr').getAttribute('id');
            console.log(expesneId)
        }

    })


}


document.getElementById('delete').addEventListener('click', function () {
    axios.delete(`http://localhost:3000/expenses/${expesneId}`, { headers: { Authorization: token } })
        .then(response => {
            document.getElementById(expesneId).remove();

            bootstrap.Modal.getInstance(document.getElementById('target')).hide();
        })
        .catch(error => {
            console.log(error);
        });
});




