document.addEventListener("DOMContentLoaded", async () => {

    if(localStorage.getItem('token')) window.location.href='expenses.html';

})

const container = document.getElementById('container');

const form = document.getElementById('create-form');
form.addEventListener('submit', createUser);

const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

const hint = document.querySelector('#passwordHint');
let lastSentMail;


async function createUser(e) {

	e.preventDefault();

	if (email.value === lastSentMail) {
		return;
	}

	const newUser = {
		name: name.value,
		email: email.value,
		password: password.value
	}


	try {
		const response = await axios.post(`http://localhost:3000/user/create-user`, newUser);

		localStorage.setItem('token',response.data.token);
		name.value = '';
		email.value = '';
		password.value = '';

		window.location.href='expenses.html';
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