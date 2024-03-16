const notPremium=document.querySelector('.not-premium');

document.addEventListener('DOMContentLoaded', async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    try {
        const response = await axios.get(`http://localhost:3000/reports/?date=${formattedDate}`, { headers: { 'Authorization': token } });
       response.data.forEach(item=>{
        addRow(item);
       })
    }

    catch(e){
        console.log(e)
        if(e.response.status==403){
            notPremium.style.display='flex';
            document.querySelector('.main-container').style.display='none';
        }
    }

    

})

const type = document.getElementById('type');
const dateInput = document.querySelector('.date-input');
const monthInput = document.querySelector('.month-input')

const form = document.getElementById('dmy');

const date = document.getElementById('date');
const month = document.getElementById('month');
let selected = date;

const token = localStorage.getItem('token');

const reportDate = document.getElementById('report-date');
const reportDesc = document.getElementById('report-desc');

function getMonth(dateString) {
    const [year, month] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

const tableBody = document.getElementById('expense-data');
const icon = document.querySelector('.fa-solid');
const img = document.querySelector('#img');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let queryParam;
    if (selected === month) queryParam = `?month=${selected.value}`
    else queryParam = `?date=${selected.value}`
    const response = await axios.get(`http://localhost:3000/reports/${queryParam}`, { headers: { 'Authorization': token } });
    tableBody.textContent = ``;
    if (type.value === 'date') {
        reportDate.textContent = selected.value;
        reportDesc.textContent = `Daily Report`;
    }
    else {
        reportDate.textContent = getMonth(selected.value);
        reportDesc.textContent = `Monthly Report`;
    }

    if (response.data.length === 0) {
        img.style.display = 'block';
        icon.style.display = 'none';
        return;
    }

    img.style.display = 'none';
    response.data.forEach((item) => {
        addRow(item);
    })

    icon.style.display = 'block';
})

function toggleClass(a, b) {
    a.style.display = 'block';
    b.style.display = 'none';
}

type.addEventListener('change', (e) => {
    if (e.target.value === 'month') {
        toggleClass(monthInput, dateInput);
        selected = month;
    }

    else {
        toggleClass(dateInput, monthInput);
        selected = date;
    }
})


async function downloadFile() {
    const url = await axios.get(`http://localhost:3000/reports/download`, { headers: { 'Authorization': token } });
    console.log(url)
    window.location.href = url.data
}


function addRow(item) {

    const { category, amount, date, description } = item;



    const newRow = document.createElement('tr');
    newRow.setAttribute('id', item.id);

    const descCell = document.createElement('td');

    const categoryCell = document.createElement('td');
    descCell.classList.add('category', category);

    const dateCell = document.createElement('td');
    const amountCell = document.createElement('td');



    descCell.textContent = description;
    dateCell.textContent = date;
    amountCell.textContent = '$ ' + amount;
    categoryCell.textContent = category;

    // Append cells to the row
    newRow.appendChild(descCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(amountCell);



    // Append the row to the table body
    tableBody.appendChild(newRow);

}