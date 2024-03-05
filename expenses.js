const token = localStorage.getItem('token');
let expesneId = null;
const expenseAmount = document.querySelector('.te');
const username=document.querySelector('.username');


document.addEventListener("DOMContentLoaded", async () => {
    const response = await axios.get(`http://localhost:3000/expenses`, { headers: { 'Authorization': token } });
    const decodedTOken=parseJwt(token);

    username.textContent=decodedTOken.name;

    response.data.expenses.forEach(item => {
        addRow(item);
    })
    expenseAmount.textContent = response.data.totalExpense;

})

let form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', addExpense);

async function addExpense(e) {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const amount = document.getElementById('money').valueAsNumber;
    const date = document.getElementById('date').value;
    const description = document.getElementById('desc').value;

    const expenseData = {
        category,
        amount,
        date,
        description
    };

    const response = await axios.post(`http://localhost:3000/expenses/add-expense`, expenseData, { headers: { 'Authorization': token } });
    expenseAmount.textContent = parseFloat(expenseAmount.textContent) + amount;
    form.reset();

    addRow(response.data);


}





const tableBody = document.getElementById('table-data');

function addRow(expense) {
    const { category, amount, date, description } = expense;



    const newRow = document.createElement('tr');
    newRow.setAttribute('id', expense.id);

    const descCell = document.createElement('td');

    const categoryCell = document.createElement('td');
    descCell.classList.add('category', category);

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
        }

    })


}

const search = document.getElementById('search');


document.querySelector('.fa-search').addEventListener('click', (e) => {
    search.style.display = (search.style.display === 'block') ? 'none' : 'block';
    if (search.style.display === 'block') {
        search.focus();
        search.addEventListener('keyup', debouncedSearch);
    }
    else if (search.value !== '') {
        search.value = '';
        tableBody.querySelectorAll('tr').forEach(row => row.style.display = '');
    }

})

const debounce = (fun, wait = 400) => {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fun();

        }, wait)
    }
}

const debouncedSearch = debounce(() => {
    const searchKey = search.value.toLowerCase();
    tableBody.querySelectorAll('tr').forEach(row => {
        const cell = row.querySelector(':first-child');
        if (cell.textContent.toLowerCase().includes(searchKey)) {
            row.style.display = '';
            return;
        }
        row.style.display = 'none';
    })
});

document.getElementById('delete').addEventListener('click', function () {
    axios.delete(`http://localhost:3000/expenses/${expesneId}`, { headers: { Authorization: token } })
        .then(response => {
            const tr = document.getElementById(expesneId);
            const amount = tr.querySelector('td:nth-child(4)').textContent;
            const value = amount.split(" ")[1];
            expenseAmount.textContent = parseFloat(expenseAmount.textContent) - value;
            tr.remove();

            bootstrap.Modal.getInstance(document.getElementById('target')).hide();
        })
        .catch(error => {
            console.log(error);
        });
});
