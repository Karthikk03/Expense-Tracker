const baseUrl='http://ec2-3-110-86-43.ap-south-1.compute.amazonaws.com:3000'

document.addEventListener("DOMContentLoaded", async () => {

    if(localStorage.getItem('token')) window.location.href='expenses.html';

})


const container = document.getElementById('container');

const loginForm = document.getElementById('login-form')


loginForm.addEventListener('submit', loginUser);


const mail = document.getElementById('mail');
const pass = document.getElementById('pass');

let prevMail, prevPass;

async function loginUser(e) {
	e.preventDefault();
	if (mail.value === prevMail && pass.value === prevPass) return;

	try {
		prevMail = mail.value;
		prevPass = pass.value;
		const response = await axios.post(`${baseUrl}/user/login`, { email: mail.value, password: pass.value });
		console.log(response.data)
		localStorage.setItem('token', response.data.token);
		mail.value = '';
		pass.value = '';

		window.location.href = 'expenses.html';
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




