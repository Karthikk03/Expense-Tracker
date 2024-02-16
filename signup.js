const container = document.getElementById('container');

const form=document.getElementById('create-form');
form.addEventListener('submit', createUser);

const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

let lastSentMail = '';

async function createUser(e) {
    	const newUser = {
    		name: name.value,
    		email: email.value,
    		password: password.value
    	}
    
    	if (newUser.email === lastSentMail) {
    		return;
    	}
    	try {
    		await axios.post(`http://localhost:3000/user/create-user`, newUser);
    		name.value = '';
    		email.value = '';
    		password.value = '';
    
    	}
    	catch (e) {
    		lastSentMail = newUser.email;
    
    		const existingError = document.querySelector('.existing');
    		if (existingError) existingError.remove();
    		if (e.response.data.code === 1) {
    			let p = document.createElement('p');
    			p.className = 'existing';
    			p.textContent = `${e.response.data.error} please login`;
    			signinForm.appendChild(p);
    		}
    	}
    }
    
    
    email.addEventListener('input', () => {
    	const error = document.querySelector('.existing');
    
    	if (error) error.remove();
    })