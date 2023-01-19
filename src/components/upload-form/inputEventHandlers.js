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

	getCarNameInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#first-invalid-span');

				if (textarea.value.match(/[\w'".-]{2,}/g)?.length < 3 || !textarea.value.match(/[\w'".-]{2,}/g)) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 3 words';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getEngineInfoInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#second-invalid-span');

				if (textarea.value.match(/[\w'".-]{2,}/g)?.length < 2 || !textarea.value.match(/[\w'".-]{2,}/g)) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getPowerInfoInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#third-invalid-span');

				if (textarea.value.match(/[\w'".-]{2,}/g)?.length < 2 || !textarea.value.match(/[\w'".-]{2,}/g)) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getTopSpeedInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#fourth-invalid-span');

				if (+textarea.value < 1) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getWeightInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#fifth-invalid-span');

				if (+textarea.value < 1) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},

	getExtraInfoInputHandler() {
		let timeout;

		return (ev) => {
			const textarea = ev.currentTarget;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#textarea-invalid-span');

				if (textarea.value.match(/[\w'".-]{2,}/g)?.length < 4 || (!textarea.value.match(/[\w'".-]{2,}/g) && textarea.value != '')) {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 4 words';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000);
		}
	},
};