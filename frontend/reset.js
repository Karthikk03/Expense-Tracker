let form = document.querySelector('#form1');


form.addEventListener('submit', reset);

async function reset(e) {
    e.preventDefault();
    const msg = document.querySelector('.msg');

    if(msg.style.display==='block')msg.style.display='none';

    const mail = document.getElementById('mail').value;
    if (mail === '') {
        const p = document.createElement('p');
        p.textContent = 'Please enter your mail';
        form.appendChild(p);
        return;
    }


    try {
        const res = await axios.post(`http://localhost:3000/password/forgot`, { mail });
        console.log(res);
        msg.textContent=`Reset link has been sent to your mail`
    }

    catch (e) {
        console.log(e)
        if (e.response && e.response.status == 400) msg.textContent = `Account doesn't exist`;
        //else msg.textContent = 'An error occurred. Please try again later.';

    }


    msg.style.display = 'block';

}