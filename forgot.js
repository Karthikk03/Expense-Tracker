let form=document.getElementsByTagName('form')[0];


form.addEventListener('submit',reset);

async function reset(e){
    e.preventDefault();
    const mail=document.getElementById('mail').value;
    if(mail===''){
        const p=document.createElement('p');
        p.textContent='Please enter your mail';
        form.appendChild(p);
        return ;
    }

    const res=await axios.post(`http://localhost:3000/password/forgot`, {mail});

    if(res.status===200){
        console.log('ok');
    }
}