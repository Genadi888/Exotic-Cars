export function getCollapseClickHandler(topShadowRoot) {
	let clickedNavBtn = false;
	const transitionDelay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '1s';

	return (ev) => {
		ev.stopPropagation();
		const menuContainer = topShadowRoot.querySelector('#drop-down-menu-container');
		const button = ev.currentTarget;
		menuContainer.style.transition = `transform ${transitionDelay} ease-in-out`;

		if (!clickedNavBtn) {
			menuContainer.style.transform = 'translateY(0%)';
			clickedNavBtn = true;
			button.disabled = true;
		} else {
			menuContainer.style.transform = 'translateY(-100%)';
			clickedNavBtn = false;
			button.disabled = true;
		}

		menuContainer.addEventListener('transitionend', () => {
			button.removeAttribute('disabled');
		})
	}
}

export function getUsernameInputHandler() {
	let timeout;

	return ev => {
		clearTimeout(timeout);

		const inputEl = ev.currentTarget;
		const span = inputEl.parentElement.querySelector('#first-invalid-span');
		const username = inputEl.value.trim();

		timeout = setTimeout(() => {
			if (username.length < 4) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short name';
			} else if (username.split(' ').some(word => word.length < 2)) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short words';
			} else if (username.match(/[\r\n~`!%^&*()=+\[{\]}\|:;\",<.>/?]/g) ||
				(username.includes("'") && !username.match(/^([a-zA-Z]+(?:'[a-zA-Z])?[a-zA-Z]*)$/g))) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'invalid symbols';
			} else {
				inputEl.classList.remove('is-invalid');
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
		const span = inputEl.parentElement.querySelector('#second-invalid-span');
		const password = inputEl.value.trim();

		timeout = setTimeout(() => {
			if (password.length < 8) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'too short password';
			} else if (!password.match(/\d/g)) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'digit required';
			} else if (!password.match(/\D/g)) {
				inputEl.classList.add('is-invalid');
				span.style.display = 'block';
				span.textContent = 'non digit symbol required';
			} else {
				inputEl.classList.remove('is-invalid');
				span.style.display = 'none';
			}
		}, 1000)
	}
}