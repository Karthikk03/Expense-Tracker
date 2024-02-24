const token = localStorage.getItem('token');
const prem = document.getElementById('prem');

document.addEventListener("DOMContentLoaded", async (event) => {
   const token = localStorage.getItem('token');
   const decodedTOken=parseJwt(token);
   if(decodedTOken.isPremium===true)prem.style.display='none';

   const response=await axios.get(`http://localhost:3000/leaderboard`, { headers: { 'Authorization': token } });
   console.log(response.data)
   // showLeaderboard(response.data);
});

function showLeaderboard(leaderboard){
   console.log(leaderboard);
}

function parseJwt(token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}

prem.addEventListener('click', handlePayment);

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
            const decodedTOken=parseJwt(res.data.token);
            if(decodedTOken.isPremium===true)prem.style.display='none';
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

