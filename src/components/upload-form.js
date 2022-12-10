import { html, render as litRender } from "../lib/lit-html.js";

export function defineUploadForm() {
	class UploadForm extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		connectedCallback() {
			litRender(html`
				<link rel="stylesheet" href="/css/upload-form.css">
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
					integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
				
				<form class="grid-container">
					<div class="grid-item grid-item-1">
						<div class="drop-zone">
							<span class="drop-zone__prompt">Drop file here or click to upload</span>
							<!-- <div class="drop-zone__thumb" data-label="myFile.txt"></div> -->
							<input type="file" name="userImages" class="drop-zone__input" accept=".jpg,.jpeg,.png," multiple>
						</div>
					</div>
					<div class="grid-item grid-item-2">
						<label for="top-speed">Car name:</label>
						<input class="form-control" type="text" placeholder="Mitsubishi Lancer Evolution X"
							aria-label="default input example" type="text" name="car-name" placeholder="Car name">
						<label for="top-speed">Engine info:</label>
						<input class="form-control" type="text" placeholder="2.0 MIVEC FQ-360" aria-label="default input example"
							type="text" name="engine-info" placeholder="Engine info">
						<label for="top-speed">Power:</label>
						<input class="form-control" type="text" placeholder="359 Hp @ 6500 rpm" aria-label="default input example"
							type="text" name="power" placeholder="Power">
						<span id="top-speed-and-weight">
							<input class="form-control" type="number" placeholder="Top speed" aria-label="default input example"
								type="number" name="top-speed" placeholder="Top speed">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input" type="radio" name="speed-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										km/h
									</label>
								</span>
								<span>
									<input class="form-check-input" type="radio" name="speed-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										mph
									</label>
								</span>
							</div>
							<input class="form-control" type="number" placeholder="Weight" aria-label="default input example"
								type="number" name="weight" placeholder="Weight">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input" type="radio" name="weight-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										kgs
									</label>
								</span>
								<span>
									<input class="form-check-input" type="radio" name="weight-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										lbs
									</label>
								</span>
							</div>
						</span>
					</div>
					<div class="grid-item grid-item-3">
						<div class="form-floating">
							<textarea class="form-control extra-info" placeholder="Leave a comment here"
								id="floatingTextarea"></textarea>
							<label for="floatingTextarea">Extra info (optional)</label>
						</div>
						<input class="btn btn-primary" type="submit" value="Submit">
					</div>
				</form>
			`, this.shadowRoot);

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