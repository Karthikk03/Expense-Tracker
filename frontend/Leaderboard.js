const token = localStorage.getItem('token');
const username = document.querySelector('.username');
const premiumDiv = document.querySelector('.not-premium')
const tableDiv=document.querySelector('.table-data');

document.addEventListener("DOMContentLoaded", async (event) => {
   const token = localStorage.getItem('token');
   const decodedTOken = parseJwt(token);
   username.textContent = decodedTOken.name;
   if (decodedTOken.isPremium === true) {
      tableDiv.style.display='flex';
      const response = await axios.get(`http://localhost:3000/leaderboard`, { headers: { 'Authorization': token } });
      console.log(response.data)
      response.data.forEach(item=>{
         addRow(item);
      })
   }

   else{
      premiumDiv.style.display = 'flex';
      
   }
});

const tableBody = document.getElementById('table-body');
let counter=1;

function addRow(userLi) {
   const newRow=document.createElement('tr');

   const counterCell=document.createElement('td');
   counterCell.textContent=counter++;

   const name = document.createElement('td');
   name.textContent=userLi.name;

   const totalExpense = document.createElement('td');
   totalExpense.textContent=userLi.totalExpense;

   newRow.appendChild(counterCell);
   newRow.appendChild(name);
   newRow.appendChild(totalExpense);


   tableBody.appendChild(newRow);

   console.log(name.textContent===username.textContent)
   if(name.textContent===username.textContent)newRow.classList.add('current');

}

document.getElementById('buyButton').addEventListener('click',handlePayment);

async function handlePayment() {

   try {
      
      const response = await axios.get(`http://localhost:3000/purchase`, { headers: { 'Authorization': token } });

      console.log(response)

      var options = {
         'key': response.data.key_id,
         'order_id': response.data.order.id,
         'handler': async (response) => {
            const res = await axios.post('http://localhost:3000/updatePayment', {
               orderId: options.order_id,
               paymentId: response.razorpay_payment_id,
               status: 'Successful'

            }, { headers: { 'Authorization': token } });
            alert('Payment Successful');
            console.log(res.data)
            localStorage.setItem('token', res.data.token);
            location.reload();
         }
      }

      var rzp = new Razorpay(options);
      rzp.open();
   }
   catch (e) {
      console.log(e);
   }

   rzp.on('payment.failed', async (response) => {
      await axios.post('http://localhost:3000/updatePayment', {
         orderId: options.order_id,
         payment_Id: response.razorpay_payment_id,
         status: 'Failure'
      }, { headers: { 'Authorization': token } })
      alert('Payement failed');
   })
}
