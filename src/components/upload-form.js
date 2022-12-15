import { html, render as litRender } from "../lib/lit-html.js";

export function defineUploadForm() {
	class UploadForm extends HTMLElement {
		#changeEventHandlers = {
			//TODO: continue the sanitization

			imagesInputHandler(ev) {
				if (ev.target.files.length > 4) {
					const filesArr = [...ev.target.files].slice(0, 4);
					const dataTransfer = new DataTransfer();
					filesArr.forEach(file => dataTransfer.items.add(file));
					ev.target.files = dataTransfer.files;
					console.log(ev.target.files)
				}
			},

			carNameInputHandler(ev) {
				const inputEl = ev.target;
				const span = ev.target.parentElement.querySelector('#first-invalid-span');

				//? check for at least 3 words
				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 3 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 3 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			},

			engineInfoInputHandler(ev) {
				const inputEl = ev.target;
				const span = ev.target.parentElement.querySelector('#second-invalid-span');

				//? check for at least 3 words
				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 2 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			},

			powerInfoInputHandler(ev) {
				const inputEl = ev.target;
				const span = ev.target.parentElement.querySelector('#third-invalid-span');

				//? check for at least 3 words
				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 2 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 2 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			},

			extraInfoInputHandler(ev) {
				const inputEl = ev.target;
				const span = ev.target.parentElement.querySelector('#textarea-invalid-span');

				//? check for at least 3 words
				if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 4 || !inputEl.value.match(/[\w'".-]{2,}/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least 4 words';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			},
		};

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		connectedCallback() {
			const htmlTemplate = (changeEventHandlers) => html`
				<link rel="stylesheet" href="/css/upload-form.css">
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
					integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
				
				<form class="grid-container">
					<div class="grid-item grid-item-1">
						<div class="drop-zone">
							<span class="drop-zone__prompt">Drop images here or click to upload<br>(4 maximum)</span>
							<!-- <div class="drop-zone__thumb" data-label="myFile.txt"></div> -->
							<input @change=${changeEventHandlers.imagesInputHandler} type="file" name="images" class="drop-zone__input"
								accept=".jpg,.jpeg,.png," multiple>
						</div>
					</div>
					<div class="grid-item grid-item-2">
						<label for="car-name">Car name:</label>
						<input @change=${changeEventHandlers.carNameInputHandler} class="form-control" type="text"
							placeholder="Mitsubishi Lancer Evolution X" aria-label="default input example" type="text" name="car-name"
							maxlength="40">
						<span class="invalid-span" id="first-invalid-span">Invalid name</span>
				
						<label for="engine-info">Engine info:</label>
						<input @change=${changeEventHandlers.engineInfoInputHandler} class="form-control" type="text"
							placeholder="2.0 MIVEC FQ-360" aria-label="default input example" type="text" name="engine-info"
							maxlength="30">
						<span class="invalid-span" id="second-invalid-span">Invalid engine info</span>
				
						<label for="power">Power:</label>
						<input @change=${changeEventHandlers.powerInfoInputHandler} class="form-control" type="text"
							placeholder="359 Hp @ 6500 rpm" aria-label="default input example" type="text" name="power" maxlength="30">
						<span class="invalid-span" id="third-invalid-span">Invalid power info</span>
				
						<span id="top-speed-and-weight">
							<input class="form-control" type="number" placeholder="Top speed" aria-label="default input example"
								type="number" name="top-speed">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
										id="flexRadioDefault1">
									<label class="form-check-label" for="speed-unit">
										km/h
									</label>
								</span>
								<span>
									<input class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
										id="flexRadioDefault1">
									<label class="form-check-label" for="speed-unit">
										mph
									</label>
								</span>
							</div>
							<input class="form-control" type="number" placeholder="Weight" aria-label="default input example"
								type="number" name="weight">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input weight-radios" type="radio" name="weight-unit"
										id="flexRadioDefault1">
									<label class="form-check-label" for="weight-unit">
										kgs
									</label>
								</span>
								<span>
									<input class="form-check-input weight-radios" type="radio" name="weight-unit"
										id="flexRadioDefault1">
									<label class="form-check-label" for="weight-unit">
										lbs
									</label>
								</span>
							</div>
						</span>
					</div>
					<div class="grid-item grid-item-3">
						<div class="form-floating">
							<textarea @change=${changeEventHandlers.extraInfoInputHandler} class="form-control extra-info"
								name="extra-info" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
							<label for="floatingTextarea">Extra info (optional)</label>
							<span class="invalid-span" id="textarea-invalid-span">Invalid extra info</span>
						</div>
						<input disabled class="btn btn-primary" type="submit" value="Submit">
					</div>
				</form>
			`;

			litRender(htmlTemplate(this.#changeEventHandlers), this.shadowRoot);

			this.#addDragAndDrop();
			this.handleSubmit();
		}

		handleSubmit() {
			const form = this.shadowRoot.querySelector('form');

			const imagesInput = form.querySelector('input[name="images"]');
			const carNameInput = form.querySelector('input[name="car-name"]');
			const engineInfoInput = form.querySelector('input[name="engine-info"]');
			const powerInput = form.querySelector('input[name="power"]');
			const topSpeedInput = form.querySelector('input[name="top-speed"]');
			const weightInput = form.querySelector('input[name="weight"]');

			const speedUnit = [...form.querySelectorAll('.speed-unit-radios')]
				.find(el => el.checked)
				.parentElement
				.querySelector('label')
				.textContent
				.trim();
			const weightUnit = [...form.querySelectorAll('.weight-radios')]
				.find(el => el.checked)
				.parentElement
				.querySelector('label')
				.textContent
				.trim();
			//
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