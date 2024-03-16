const container = document.getElementById('container');

const loginForm = document.getElementById('login-form')


loginForm.addEventListener('submit', loginUser);


const mail = document.getElementById('mail');
const pass = document.getElementById('pass');


async function loginUser(e) {
	const existingError = document.querySelector('.noUser');
	if (existingError) existingError.remove();

	e.preventDefault();

	try {
		const response =await axios.post(`http://localhost:3000/user/login`, { email: mail.value, password: pass.value });
		console.log(response.data)
		localStorage.setItem('token',response.data.token);
		mail.value = '';
		pass.value = '';
		
		window.location.href='expenses.html';
	}
	catch (e) {
		const invalid = document.querySelector('.invalid');
		if (invalid) invalid.remove();

		let p = document.createElement('p');


		if (e.response.status === 404) {
			p.textContent = 'Please create account first';
			p.className = 'noUser';
			loginForm.appendChild(p);
		}

		else if (e.response.status === 401) {
			p.textContent = 'Invalid Credentials';
			p.className = 'invalid';
			loginForm.appendChild(p);
		}
	}
}

mail.addEventListener('input', () => {
	removeError('.noUser');
	removeError('.invalid');
})

pass.addEventListener('input', () => {
	removeError('.invalid');
})

function removeError(selector) {
	const error = document.querySelector(selector);
	if (error) error.remove();
}




