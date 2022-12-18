import { html, render as litRender } from "../lib/lit-html.js";

export function defineUploadForm() {
	class UploadForm extends HTMLElement {
		#inputEventHandlers = {
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

		#getFormInputEventHandler() {
			let timeout;

			return ev => {
				clearTimeout(timeout);

				const form = ev.currentTarget;
				const imagesInput = form.querySelector('input[name="images"]');
				const fieldsAreNotEmpty = [...form.querySelectorAll('input.form-control')].every(el => el.value != '');
				const submitBtn = form.querySelector('input[type="submit"]');
				submitBtn.disabled = true;
				

				timeout = setTimeout(() => {
					if (!form.querySelector('.is-invalid') && fieldsAreNotEmpty && imagesInput.files.length != 0) {
						submitBtn.removeAttribute('disabled');
					}
					else {
						submitBtn.disabled = true;
					}
				}, 1000)
			}
		}

		#formSubmitEventHandler(ev) {
			ev.preventDefault();
			const form = ev.currentTarget;

			const formData = new FormData(form);
			const speedUnit = [...form.querySelectorAll('.speed-unit-radios')].find(el => el.checked).value;
			const weightUnit = [...form.querySelectorAll('.weight-radios')].find(el => el.checked).value;

			const objToSubmit = {
				images: formData.getAll('images'),
				carName: formData.get('car-name'),
				engineInfo: formData.get('engine-info'),
				power: formData.get('power'),
				topSpeed: `${formData.get('top-speed')} ${speedUnit}`,
				weight: `${formData.get('weight')} ${weightUnit}`,
				extraInfo: formData.get('extra-info')
			}
			// console.log(objToSubmit)
		}

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		connectedCallback() {
			const htmlTemplate = (inputEventHandlers, getFormInputEventHandler, formSubmitEventHandler) => html`
				<link rel="stylesheet" href="/css/upload-form.css">
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
					integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
				
				<form @submit=${formSubmitEventHandler} @input=${getFormInputEventHandler()} class="grid-container">
					<div class="grid-item grid-item-1">
						<div class="drop-zone">
							<span class="drop-zone__prompt">Drop images here or click to upload<br>(4 maximum)</span>
							<!-- <div class="drop-zone__thumb" data-label="myFile.txt"></div> -->
							<input @change=${inputEventHandlers.imagesInputHandler} type="file" name="images" class="drop-zone__input"
								accept=".jpg,.jpeg,.png," multiple>
						</div>
					</div>
					<div class="grid-item grid-item-2">
						<label for="car-name">Car name:</label>
						<input @input=${inputEventHandlers.getCarNameInputHandler()} class="form-control" type="text"
							placeholder="Mitsubishi Lancer Evolution X" aria-label="default input example" type="text" name="car-name"
							maxlength="40">
						<span class="invalid-span" id="first-invalid-span">Invalid name</span>
				
						<label for="engine-info">Engine info:</label>
						<input @input=${inputEventHandlers.getEngineInfoInputHandler()} class="form-control" type="text"
							placeholder="2.0 MIVEC FQ-360" aria-label="default input example" type="text" name="engine-info"
							maxlength="30">
						<span class="invalid-span" id="second-invalid-span">Invalid engine info</span>
				
						<label for="power">Power:</label>
						<input @input=${inputEventHandlers.getPowerInfoInputHandler()} class="form-control" type="text"
							placeholder="359 Hp @ 6500 rpm" aria-label="default input example" type="text" name="power" maxlength="30">
						<span class="invalid-span" id="third-invalid-span">Invalid power info</span>
				
						<span id="top-speed-and-weight">
							<div id="top-speed-div">
								<input @input=${inputEventHandlers.getTopSpeedInputHandler()} class="form-control" type="number"
									placeholder="Top speed" aria-label="default input example" name="top-speed">
								<span class="invalid-span" id="fourth-invalid-span">invalid speed</span>
							</div>
				
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
										id="flexRadioDefault1" value="km/h">
									<label class="form-check-label" for="speed-unit">
										km/h
									</label>
								</span>
								<span>
									<input class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
										id="flexRadioDefault1" value="mph">
									<label class="form-check-label" for="speed-unit">
										mph
									</label>
								</span>
							</div>
				
							<div id="weight-div">
								<input @input=${inputEventHandlers.getWeightInputHandler()} class="form-control" type="number"
									placeholder="Weight" aria-label="default input example" name="weight">
								<span class="invalid-span" id="fifth-invalid-span">invalid weight</span>
							</div>
				
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input weight-radios" type="radio" name="weight-unit"
										id="flexRadioDefault1" value="kgs">
									<label class="form-check-label" for="weight-unit">
										kgs
									</label>
								</span>
								<span>
									<input class="form-check-input weight-radios" type="radio" name="weight-unit" id="flexRadioDefault1"
										value="lbs">
									<label class="form-check-label" for="weight-unit">
										lbs
									</label>
								</span>
							</div>
						</span>
					</div>
					<div class="grid-item grid-item-3">
						<div class="form-floating">
							<textarea @input=${inputEventHandlers.getExtraInfoInputHandler()} class="form-control extra-info"
								name="extra-info" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
							<label for="floatingTextarea">Extra info (optional)</label>
							<span class="invalid-span" id="textarea-invalid-span">Invalid extra info</span>
						</div>
						<input disabled class="btn btn-primary" type="submit" value="Submit">
					</div>
				</form>
			`;

			litRender(htmlTemplate(this.#inputEventHandlers, this.#getFormInputEventHandler, this.#formSubmitEventHandler), this.shadowRoot);

			this.#addDragAndDrop();
		}

		#addDragAndDrop() {
			const inputElement = this.shadowRoot.querySelector('.drop-zone__input');
			const dropZoneElement = inputElement.closest('.drop-zone');

			dropZoneElement.addEventListener('click', () => {
				inputElement.click();
			});

			inputElement.addEventListener('change', () => {
				if (inputElement.files.length) {
					updateThumbnail(dropZoneElement, inputElement.files);
				}
			});

			dropZoneElement.addEventListener('dragover', ev => {
				ev.preventDefault();
				dropZoneElement.classList.add('drop-zone--over');
			});

			//? here I am adding event listeners for the "dragleave" and "dragend" events
			['dragleave', 'dragend'].forEach(type => {
				dropZoneElement.addEventListener(type, () => {
					dropZoneElement.classList.remove('drop-zone--over');
				});
			});

			dropZoneElement.addEventListener('drop', ev => {
				ev.preventDefault();
				const filesArr = [...ev.dataTransfer.files].filter(file => file.type.startsWith('image/'));

				if (filesArr.length) {
					const dataTransfer = new DataTransfer();
					filesArr.forEach(file => dataTransfer.items.add(file));
					inputElement.files = dataTransfer.files;
					updateThumbnail(dropZoneElement, inputElement.files);
				}

				dropZoneElement.classList.remove('drop-zone--over');
			});

			/** 
				* @param {HTMLElement} dropZoneElement
			*/

			function updateThumbnail(dropZoneElement, fileList) {
				const filesArr = [...fileList];
				let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

				if (dropZoneElement.querySelector('.drop-zone__prompt')) {
					dropZoneElement.querySelector('.drop-zone__prompt').remove();
				}

				//? If there's no a thumbnail element, It needs to be created
				if (!thumbnailElement) {
					thumbnailElement = document.createElement('div');
					thumbnailElement.classList.add('drop-zone__thumb');
					dropZoneElement.appendChild(thumbnailElement)
				}

				let label = '';
				filesArr.forEach(file => label += file.name + ', ');
				label = label.slice(0, -2);  //? here the last comma and space are excluded from the final label
				thumbnailElement.dataset.label = label;

				const reader = new FileReader();
				reader.readAsDataURL(filesArr[0]);
				reader.addEventListener('load', () => {
					thumbnailElement.style.backgroundImage = `url(${reader.result})`;
				});
			}
		}
	}

	if (window.customElements.get('upload-form') == undefined) {
		window.customElements.define('upload-form', UploadForm);
	}
}