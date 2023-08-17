export function getUserData() {
	return JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData')) || undefined;
}
export function setUserData(data, remember) {
	sessionStorage.setItem('userData', JSON.stringify(data));
	if (remember) {
		localStorage.setItem('userData', JSON.stringify(data));
	}
}
export function deleteUserData() {
	sessionStorage.removeItem('userData');
	localStorage.removeItem('userData');
}

export function getUsernameInputHandler() {
	let timeout;

	return ev => {
		clearTimeout(timeout);

		const inputEl = ev.currentTarget;
		const span = inputEl.parentElement.querySelector('#first-invalid-span');
		const username = inputEl.value.trim();

		timeout = setTimeout(() => {
			if (username.length > 0 && username.length < 4) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short name';
			} else if (username.split(' ').some(word => word.length < 2)) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short words';
			} else if (username.match(/[\r\n~`!%^&*()=+\[{\]}\|:;\",<.>/?]/g) ||
				(username.includes("'") && !username.match(/^([a-zA-Z]+(?:'[a-zA-Z])?[a-zA-Z]*)$/g))
				&& username.length > 0) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'invalid symbols';
			} else {
				inputEl.classList.remove('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'none';
			}
		}, 1000)
	}
}

export function getPasswordInputHandler() {
	let timeout;

	return ev => {
		clearTimeout(timeout);

		const inputEl = ev.currentTarget;
		const span = inputEl.parentElement
		.querySelector('#second-invalid-span, #first-invalid-password-span, #second-invalid-password-span');
		const password = inputEl.value.trim();

		timeout = setTimeout(() => {
			if (password.length > 0 && password.length < 8) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short password';
			} else if (!password.match(/\d/g) && password.length > 0) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'digit required';
			} else if (!password.match(/\D/g) && password.length > 0) {
				inputEl.classList.add('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'block';
				span.textContent = 'non-digit symbol required';
			} else {
				inputEl.classList.remove('is-invalid', 'mandatory-is-invalid');
				span.style.display = 'none';
			}
		}, 1000)
	}
}

export function getEmailInputHandler() {
	let timeout;

	return ev => {
		clearTimeout(timeout);

		const inputEl = ev.currentTarget;
		const span = inputEl.parentElement.querySelector('input[type="email"] + .invalid-span');
		const email = inputEl.value.trim();

		timeout = setTimeout(() => {
			if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/) && email != '') {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'invalid email';
			} else {
				inputEl.classList.remove('is-invalid');
				span.style.display = 'none';
			}
		}, 1000)
	}
}

export function getRegisterFormInputHandler() {
	let timeout;

	return ev => {
		clearTimeout(timeout);

		const form = ev.currentTarget;
		const submitBtn = form.querySelector('input[type="submit"]');
		submitBtn.disabled = true;

		timeout = setTimeout(() => {
			const fieldsAreNotEmpty = [...form.querySelectorAll('input#username, input#password')].every(el => el.value != '');

			if (!form.querySelector('.mandatory-is-invalid') && fieldsAreNotEmpty) {
				submitBtn.removeAttribute('disabled');
			}
			else {
				submitBtn.disabled = true;
			}
		}, 1000)
	}
}

export function bindForm(callback) {
	return async function (event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const asObject = 
		Object.fromEntries(
			[...formData.entries()]
			.map(([k, v]) => [k, v.trim !== undefined ? v.trim() : v])
		);

		if (event.target.querySelector('.remember-me')?.checked) {
			asObject.remember = true;
		}
		const inputs = [...event.target.querySelectorAll('input, button, textarea, select')];
		inputs.forEach(i => i.disabled = true);

		try {
			await callback(asObject, event.target);
		} catch (error) {
			console.error(error.message);
			throw error;
		} finally {
			inputs.forEach(i => i.removeAttribute('disabled'));
		}
	}
}

export function encodeImages(filesArr, WIDTH, HEIGHT) {
	function compressImages(imagesArr, WIDTH, HEIGHT) {
		return new Promise(async (resolve, reject) => {
			const compressedImages = [];
	
			for (const imageURL of imagesArr) {
				const imageEL = document.createElement('img');
				imageEL.src = imageURL;
	
				try {
					const newImageURL = await new Promise((resolve, reject) => {
						imageEL.addEventListener('load', ev => {
							const canvas = document.createElement('canvas');
							canvas.width = WIDTH;
							canvas.height = HEIGHT;
			
							const context = canvas.getContext('2d');
							context.drawImage(imageEL, 0, 0, canvas.width, canvas.height);
			
							resolve(context.canvas.toDataURL('image/jpeg', 100));
						});
		
						imageEL.addEventListener('error', ev => {
							reject(ev.error);
						});
					})
		
					compressedImages.push(newImageURL);
		
					if (compressedImages.length == imagesArr.length) {
						resolve(compressedImages);
					}
				} catch (error) {
					reject(error.message);
				}
			}
		})
	}

	return new Promise(async (resolve, reject) => {
		const encodedFiles = [];
		const reader = new FileReader();

		const readedFile = new Promise((resolve, reject) => {
			reader.addEventListener('load', () => {
				resolve(reader.result);
			})
			reader.addEventListener('error', () => {
				reject(reader.error)
			})
		})
		
		for (const file of filesArr) {
			reader.readAsDataURL(file);

			try {
				encodedFiles.push(await readedFile);
			} catch (error) {
				reject(error.message)
			}

			if (encodedFiles.length == filesArr.length) {
				resolve(await compressImages(encodedFiles, WIDTH, HEIGHT));
			}
		}
	});
}