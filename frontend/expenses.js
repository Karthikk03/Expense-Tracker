const token = localStorage.getItem('token');
let expesneId = null;
const expenseAmount = document.querySelector('#te');
const username = document.querySelector('.username');

const expenseBody = document.getElementById('expense-data');
const incomeBody = document.getElementById('income-data');

document.addEventListener("DOMContentLoaded", async () => {
    const response = await axios.get(`http://localhost:3000/expenses`, { headers: { 'Authorization': token } });
    console.log(response)
    const decodedTOken = parseJwt(token);

    username.textContent = decodedTOken.name;

    response.data.expenses.forEach(item => {
        addRow(item,expenseBody);
    })
    expenseAmount.textContent = response.data.totalExpense;



    const event = new Event('change', {
        'bubbles': true,
        'cancelable': true
    })

    document.getElementById('type').dispatchEvent(event);

})


function addOption(values, selectedOption) {

    const options = selectedOption.options;
    for (let i = options.length - 1; i >= 0; i--) {
        selectedOption.remove(i);
    }

    values.forEach(function (value) {
        var option = new Option(value, value);
        selectedOption.add(option);
    });
}
document.querySelector('#type').addEventListener('change', (e) => {
    const type = e.target.value;

    const category = document.querySelector('#category');
    let values;

    if (type === 'income') {
        values = ['Salary', 'Investment', 'Bonus'];

        addOption(values, category);

        return;
    }

    values = ['Shopping', 'Movies', 'Fitness', 'EMI', 'Travel', 'Drinks'];
    addOption(values, category);


})
let form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', addTransaction);

async function addTransaction(e) {
    e.preventDefault();

    const type = document.querySelector('#type').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('money').valueAsNumber;
    const date = document.getElementById('date').value;
    const description = document.getElementById('desc').value;

    const transactionData = {
        category,
        amount,
        date,
        description
    };

    if (type === 'expense') {
        const response = await axios.post(`http://localhost:3000/expenses/add-expense`, transactionData, { headers: { 'Authorization': token } });
        // expenseAmount.textContent = parseFloat(expenseAmount.textContent) + amount;
        form.reset();

        return addRow(response.data,expenseBody);
    }

    const response = await axios.post(`http://localhost:3000/incomes/add-income`, transactionData, { headers: { 'Authorization': token } });
        // expenseAmount.textContent = parseFloat(expenseAmount.textContent) + amount;
        form.reset();

        return addRow(response.data,incomeBody);



}

function toggleClass(a, b) {
    a.style.display = 'flex';
    b.style.display = 'none';
}

let selected = 'Expenses';
const expenseTable = document.querySelector('.expense-table');
const incomeTable = document.querySelector('.income-table');

const select = document.querySelector('.select-option');

select.addEventListener('click', (e) => {
    if (selected === e.target.textContent) return;
    e.target.classList.add('selected');
    document.querySelector(`.${selected}`).classList.remove('selected');

    selected = e.target.textContent;

    if (selected === 'Expenses') return toggleClass(expenseTable, incomeTable);

    toggleClass(incomeTable, expenseTable)
})



function addRow(transaction,tableBody) {
    const { category, amount, date, description } = transaction;



    const newRow = document.createElement('tr');
    newRow.setAttribute('id', transaction.id);

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
