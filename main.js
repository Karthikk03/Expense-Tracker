const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	console.log(1);

	container.classList.remove("right-panel-active");
});

const loginForm = document.getElementById('login-form')

const signinForm = document.getElementById('create-form');

loginForm.addEventListener('submit', loginUser);

signinForm.addEventListener('submit', createUser);

const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

let lastSentMail = '';

const mail = document.getElementById('mail');
const pass = document.getElementById('pass');

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

async function loginUser(e) {
	e.preventDefault();
	try {
		await axios.post(`http://localhost:3000/user/login`, { email: mail.value, password: pass.value });

		mail.value='';
		pass.value='';

	}
	catch (e) {
		const existingError = document.querySelector('.noUser');
		if (existingError) existingError.remove();

		const invalid=document.querySelector('.invalid');
		if(invalid) invalid.remove();

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
	const error = document.querySelector('.noUser');

	if (error) error.remove();
})

pass.addEventListener('input', () => {
	const error = document.querySelector('.invalid');
	if (error) error.remove();
})




