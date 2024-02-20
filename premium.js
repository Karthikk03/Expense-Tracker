const token = localStorage.getItem('token');
const prem = document.getElementById('prem');

// document.addEventListener('DOMContentLoaded',async()=>{
//    const response=await axios.get(`http://localhost:3000/isPremium`, { headers: { 'Authorization': token } })
//    console.log(token);
//    if(response.data==true){
//       console.log(1);
//       prem.style.display='none';
//    }
// })

document.addEventListener("DOMContentLoaded", async (event) => {
   console.log("DOM fully loaded and parsed");
   const response = await axios.get(`http://localhost:3000/isPremium`, { headers: { 'Authorization': token } });
   console.log(response);
   if (response.data == true) {
      prem.style.display = 'none';
   }
});




prem.addEventListener('click', handlePayment);

async function handlePayment() {

   try {


      const response = await axios.get(`http://localhost:3000/purchase`, { headers: { 'Authorization': token } });

      console.log(response)

      var options = {
         'key': response.data.key_id,
         'order_id': response.data.order.id,
         'handler': async (response) => {
            await axios.post('http://localhost:3000/updatePayment', {
               orderId: options.order_id,
               payment_Id: response.razorpay_payment_id,
               status: 'Successful'

            }, { headers: { 'Authorization': token } });
            alert('Payment Successful');
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

