import { render as litRender } from "/src/lib/lit-html.js";
import { inputEventHandlers } from "./inputEventHandlers.js";
import { formTemplate } from "./formTemplate.js";
import { createPost, editPost, getPostById } from "../../api/posts.js";
import { encodeImages } from "../../util.js";
import { until } from "../../lib/directives/until.js";
import { html } from "/src/lib/lit-html.js";

export function defineCreateUploadForm(ctx) {
	class UploadForm extends HTMLElement {
		#inputEventHandlers = inputEventHandlers;

		#getFormInputEventHandler() {
			let timeout;

			return ev => {
				clearTimeout(timeout);

				const form = ev.currentTarget;
				const submitBtn = form.querySelector('input[type="submit"]');
				submitBtn.disabled = true;
				sessionStorage.setItem('userHasUnsavedData', 'true');

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

		async #formSubmitEventHandler(ev, postId) {
			ev.preventDefault();
			const form = ev.currentTarget;
			const submitBtn = form.querySelector('input[type="submit"]');
			submitBtn.disabled = true;
			submitBtn.value = "Posting...";

			const formData = new FormData(form);
			const speedUnit = [...form.querySelectorAll('.speed-unit-radios')].find(el => el.checked).value;
			const weightUnit = [...form.querySelectorAll('.weight-radios')].find(el => el.checked).value;

			const imagesArr = await encodeImages([...formData.getAll('images')], 640, 360);

			const objToSubmit = {
				images: imagesArr,
				carName: formData.get('car-name').trim(),
				engineInfo: formData.get('engine-info').trim(),
				power: formData.get('power').trim(),
				topSpeed: `${formData.get('top-speed')} ${speedUnit}`,
				weight: `${formData.get('weight')} ${weightUnit}`,
				extraInfo: formData.get('extra-info').trim()
			}

			try {
				await createPost(objToSubmit);
				ctx.page.redirect('/car-pictures');
			} catch (error) {
				alert(error.message);
				submitBtn.removeAttribute('disabled');
				submitBtn.value = "Post";
			}
		}

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		async connectedCallback() {
			litRender(await formTemplate(
				this.#inputEventHandlers,
				this.#getFormInputEventHandler(),
				this.#formSubmitEventHandler),
				this.shadowRoot
			);
			this.#addDragAndDrop();
		}

		async #addDragAndDrop() {
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
					// console.log((inputElement.files[0]));
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

				if (fileList) {
					let label = '';
					filesArr.forEach(file => label += file.name + ', ');
					label = label.slice(0, -2);  //? here the last comma and space are excluded from the final label
					thumbnailElement.dataset.label = label;
				} else {
					document.querySelector(':root').style['--thumb-padding'] = '0px';
				}

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

let editCtx = null;
export function defineEditUploadForm(paramCtx) {
	/*
		? The class EditUploadForm has access to the editCtx variable. 
		? I change the variable's reference everytime I visit the "edit-post" page because otherwise the class will always read the old context if it's present.
	*/

	editCtx = paramCtx;

	class EditUploadForm extends HTMLElement {
		#inputEventHandlers = inputEventHandlers;
		#postToEdit = null;
		#postToEditId = null;

		#getFormInputEventHandler() {
			let timeout;

			return ev => {
				clearTimeout(timeout);

				const form = ev.currentTarget;
				const submitBtn = form.querySelector('input[type="submit"]');
				submitBtn.disabled = true;
				sessionStorage.setItem('userHasUnsavedData', 'true');

				timeout = setTimeout(() => {
					const imagesInput = form.querySelector('input[name="images"]');
					const fieldsAreNotEmpty = [...form.querySelectorAll('input.form-control')].every(el => el.value != '');

					if (!form.querySelector('.is-invalid') && fieldsAreNotEmpty && (imagesInput.files.length != 0 || this.#postToEdit)) {
						submitBtn.removeAttribute('disabled');
					}
					else {
						submitBtn.disabled = true;
					}
				}, 1000)
			}
		}

		async #formSubmitEventHandler(ev, postId) {
			ev.preventDefault();
			const form = ev.currentTarget;
			const submitBtn = form.querySelector('input[type="submit"]');
			submitBtn.disabled = true;
			submitBtn.value = "Editing...";

			const formData = new FormData(form);
			const speedUnit = [...form.querySelectorAll('.speed-unit-radios')].find(el => el.checked).value;
			const weightUnit = [...form.querySelectorAll('.weight-radios')].find(el => el.checked).value;

			let imagesArr = [...formData.getAll('images')].filter(val => val.type.startsWith('image/'));

			if (imagesArr.length > 0) {
				imagesArr = await encodeImages(imagesArr);
			} else {
				imagesArr = this.#postToEdit.images;
			}

			const objToSubmit = {
				images: imagesArr,
				carName: formData.get('car-name').trim(),
				engineInfo: formData.get('engine-info').trim(),
				power: formData.get('power').trim(),
				topSpeed: `${formData.get('top-speed')} ${speedUnit}`,
				weight: `${formData.get('weight')} ${weightUnit}`,
				extraInfo: formData.get('extra-info').trim(),
				objectId: postId,
			}

			try {
				await editPost(objToSubmit);
				editCtx.page.redirect('/car-pictures');
			} catch (error) {
				alert(error.message);
				submitBtn.removeAttribute('disabled');
				submitBtn.value = "Edit";
			}
		}

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}

		async connectedCallback() {
			this.#postToEditId = editCtx.params.id.slice(1);

			const templatePromise = formTemplate(
				this.#inputEventHandlers,
				this.#getFormInputEventHandler(),
				ev => this.#formSubmitEventHandler(ev, this.#postToEditId),
				this.#postToEditId
			);

			litRender(until(
				templatePromise,
				html`
						<style>
							#loading {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								font-size: calc(15px + 3vmin) !important;
							}
						</style>
						<span id="loading">Loading post info...</span>
					`
			),
				this.shadowRoot
			);

			try {
				await templatePromise;
				this.#postToEdit = await getPostById(this.#postToEditId);
			} catch (error) {
				alert(error.message);
			}

			this.#addDragAndDrop();
			this.shadowRoot
				.querySelector('form > div.grid-item.grid-item-3 > input[type="submit"]')
				.removeAttribute('disabled');
		}

		async #addDragAndDrop() {
			const inputElement = this.shadowRoot.querySelector('.drop-zone__input');
			const dropZoneElement = inputElement.closest('.drop-zone');

			updateThumbnail(dropZoneElement, null, this.#postToEdit.images);

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
					// console.log((inputElement.files[0]));
					updateThumbnail(dropZoneElement, inputElement.files);

					inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
				}

				dropZoneElement.classList.remove('drop-zone--over');
			});

			/** 
				* @param {HTMLElement} dropZoneElement
			*/

			function updateThumbnail(dropZoneElement, fileList, imagesArr) {
				const filesArr = imagesArr || [...fileList];
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

				if (fileList) {
					let label = '';
					filesArr.forEach(file => label += file.name + ', ');
					label = label.slice(0, -2);  //? here the last comma and space are excluded from the final label
					thumbnailElement.dataset.label = label;
					dropZoneElement.style.setProperty('--thumb-padding', '5px');
				} else {
					dropZoneElement.style.setProperty('--thumb-padding', '0px');
				}

				if (imagesArr) {
					thumbnailElement.style.backgroundImage = `url(${filesArr[0]})`;
				} else {
					const reader = new FileReader();
					reader.readAsDataURL(filesArr[0]);
					reader.addEventListener('load', () => {
						thumbnailElement.style.backgroundImage = `url(${reader.result})`;
					});
				}
			}
		}
	}

	if (window.customElements.get('edit-upload-form') == undefined) {
		window.customElements.define('edit-upload-form', EditUploadForm);
	}
}