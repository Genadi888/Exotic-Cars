import { render as litRender } from "/src/lib/lit-html.js";
import { inputEventHandlers } from "./inputEventHandlers.js";
import { formTemplate } from "./formTemplate.js";

export function defineUploadForm() {
	class UploadForm extends HTMLElement {
		#inputEventHandlers = inputEventHandlers;

		#getFormInputEventHandler() {
			let timeout;

			return ev => {
				clearTimeout(timeout);
				
				const form = ev.currentTarget;
				const submitBtn = form.querySelector('input[type="submit"]');
				submitBtn.disabled = true;
				
				timeout = setTimeout(() => {
					const imagesInput = form.querySelector('input[name="images"]');
					const fieldsAreNotEmpty = [...form.querySelectorAll('input.form-control')].every(el => el.value != '');
					
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
				images: formData.getAll('images').trim(),
				carName: formData.get('car-name').trim(),
				engineInfo: formData.get('engine-info').trim(),
				power: formData.get('power').trim(),
				topSpeed: `${formData.get('top-speed')} ${speedUnit}`.trim(),
				weight: `${formData.get('weight')} ${weightUnit}`.trim(),
				extraInfo: formData.get('extra-info').trim()
			}
			// console.log(objToSubmit)
		}

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		connectedCallback() {
			litRender(formTemplate(this.#inputEventHandlers, this.#getFormInputEventHandler, this.#formSubmitEventHandler), this.shadowRoot);
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

					inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
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