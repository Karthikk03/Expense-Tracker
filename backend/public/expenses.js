const token = localStorage.getItem('token');
let expesneId = null;
const expenseAmount = document.querySelector('#te');
const username = document.querySelector('.username');

let current, lastPage;

let edit, initialState;



document.addEventListener("DOMContentLoaded", async () => {

    if(!token){
        window.location.href='index.html';
        return;
    }

    const response = await axios.get(`${baseUrl}/expenses?page_no=1`, { headers: { 'Authorization': token } });

    const decodedTOken = parseJwt(token);
    username.textContent = decodedTOken.name;

    response.data.expenses.forEach(item => {
        addRow(item);
    })
    expenseAmount.textContent = response.data.totalExpense;

    updatePages(response.data);

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

    if (edit === true) {
        const b = initialState.category !== category || initialState.amount !== amount || initialState.date !== date || initialState.description !== description;
        if (!b) {
            const p = document.createElement('p');
            p.textContent = 'Please update fields to edit expense';
            form.appendChild(p);
            setTimeout(() => {
                form.removeChild(p);
            }, 3000)
            return;

        }

        try {

            const response = await axios.patch(`${baseUrl}/expenses/edit-expense/${expesneId}`, expenseData, { headers: { 'Authorization': token } });
            updateRow(response.data);


        }
        catch (e) {
            const p = document.createElement('p');
            p.textContent = 'An error occurred while processing the expense';
            form.appendChild(p);
            setTimeout(() => {
                form.removeChild(p);
            }, 3000)
        }
        edit = false;
        form.reset();
        return;
    }


    const response = await axios.post(`${baseUrl}/expenses/add-expense`, expenseData, { headers: { 'Authorization': token } });
    expenseAmount.textContent = parseFloat(expenseAmount.textContent) + amount;
    form.reset();


    addRow(response.data.newOne);

    if (current >= lastPage - 1 && response.data.lastPage > lastPage) {
        createButton(response.data.lastPage);
        lastPage = response.data.lastPage;
    }
    else if (response.data.lastPage > lastPage) {
        lastPage = response.data.lastPage;
        pages.lastElementChild.textContent = lastPage;
    }
}

const tableBody = document.getElementById('table-body');

function addRow(expense) {
    const rows = tableBody.rows.length;
    if (rows > 5) {
        return;
    }
    const { category, amount, date, description } = expense;

    const newRow = document.createElement('tr');
    newRow.setAttribute('id', `expense-${expense.id}`);

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
        expesneId = e.target.closest('tr').getAttribute('id').split('-')[1];

        if (e.target.classList.contains('fa-edit')) editExpense(expesneId);
    })


}


function updateRow(updatedExpense) {
    const row = tableBody.querySelector(`#expense-${expesneId}`);

    const currentAmount = parseFloat(row.cells[3].textContent.split(' ')[1]);

    if(currentAmount!==updatedExpense.amount){
        expenseAmount.textContent=parseFloat(expenseAmount.textContent)-currentAmount+updatedExpense.amount;
    }

    row.cells[0].textContent = updatedExpense.description;
    row.cells[1].textContent = updatedExpense.category;

    row.cells[2].textContent = updatedExpense.date;

    row.cells[3].textContent = `$ ${updatedExpense.amount}`;
}

function updateForm() {
    document.getElementById('category').value = initialState.category;
    document.getElementById('money').value = initialState.amount;
    document.getElementById('date').value = initialState.date;
    document.getElementById('desc').value = initialState.description;

}

function editExpense(expenseId) {
    const expense = tableBody.querySelector(`#expense-${expenseId}`);

    initialState = {
        description: expense.querySelector('td:nth-child(1)').textContent,
        category: expense.querySelector('td:nth-child(2)').textContent,
        date: expense.querySelector('td:nth-child(3)').textContent,
        amount: parseInt(expense.querySelector('td:nth-child(4)').textContent.split(' ')[1])
    }


    updateForm();

    edit = true;
}


function updatePages(data) {
    Pagination(data);
    lastPage = data.lastPage;
    current = data.current;
}

function triggerPreviousButton() {
    if (current < lastPage) {
        const button = pages.querySelector('.active');
        button.click();
    }

    else if (current > 1) {
        const previous = pages.querySelector('.active').previousElementSibling;
        previous.click();
    }
    else {
        tableBody.innerHTML = ``;
    }
}

document.getElementById('delete').addEventListener('click', function () {
    axios.delete(`${baseUrl}/expenses/${expesneId}`, { headers: { Authorization: token } })
        .then(response => {
            const tr = document.getElementById(`expense-${expesneId}`);
            const amount = tr.querySelector('td:nth-child(4)').textContent;
            const value = amount.split(" ")[1];
            expenseAmount.textContent = parseFloat(expenseAmount.textContent) - value;
            tr.remove();

            bootstrap.Modal.getInstance(document.getElementById('target')).hide();

            const rows = tableBody.rows.length;
            if (rows == 0) {
                triggerPreviousButton();
            }
        })
        .catch(error => {
            console.log(error);
        });
});

function updateData(data) {


    current = data.current;

    if (data.expenses.length === 0) {
        return;
    }


    data.expenses.forEach((item) => {
        addRow(item);
    })

    Pagination(data);

}