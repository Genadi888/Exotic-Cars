export const inputEventHandlers = {
	getImagesInputHandler(ev) {
		if (ev.target.files.length > 4) {
			const filesArr = [...ev.target.files].slice(0, 4);
			const dataTransfer = new DataTransfer();
			filesArr.forEach(file => dataTransfer.items.add(file));
			ev.target.files = dataTransfer.files;
		}
		// console.log(ev.target.files)
	},

	getCarNameInputHandler(ev) {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#first-invalid-span');

				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 3 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 3 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getEngineInfoInputHandler(ev) {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#second-invalid-span');

				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 2 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getPowerInfoInputHandler(ev) {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#third-invalid-span');

				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 2 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getTopSpeedInputHandler(ev) {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#fourth-invalid-span');

				if (+inputEl.value < 1) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getWeightInputHandler(ev) {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#fifth-invalid-span');

				if (+inputEl.value < 1) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getExtraInfoInputHandler() {
		let timeout;

		return (ev) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const inputEl = ev.path[0];
				const span = inputEl.parentElement.querySelector('#textarea-invalid-span');

				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 4 || (!inputEl.value.match(/[\w'".-]{2,}/g) && inputEl.value != '')) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 4 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},
};