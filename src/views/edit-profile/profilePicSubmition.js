import { encodeImages } from "../../util.js";

export async function addProfilePicSubmition(editImageDiv) {
	const inputElement = editImageDiv.querySelector('#drop-zone-input');
	const dropZoneElement = editImageDiv;

	dropZoneElement.addEventListener('click', () => {
		inputElement.click();
	});

	inputElement.addEventListener('change', () => {
		if (inputElement.files.length) {
			updatePicture(dropZoneElement, inputElement.files[0]);
		}
	});

	dropZoneElement.addEventListener('dragover', ev => {
		ev.preventDefault();
		dropZoneElement.classList.add('edit-image--over');
	});

	//? here I am adding event listeners for the "dragleave" and "dragend" events
	['dragleave', 'dragend'].forEach(type => {
		dropZoneElement.addEventListener(type, () => {
			dropZoneElement.classList.remove('edit-image--over');
		});
	});

	dropZoneElement.addEventListener('drop', async ev => {
		ev.preventDefault();
		const file = [...ev.dataTransfer.files].filter(file => file.type.startsWith('image/'))[0];

		if (file) {
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			inputElement.files = dataTransfer.files;
			// console.log((inputElement.files[0]));
			await updatePicture(dropZoneElement, file);

			inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
		}

		dropZoneElement.classList.remove('edit-image--over');
	});

	/** 
		* @param {HTMLElement} dropZoneElement
	*/

	async function updatePicture(dropZoneElement, file) {
		let imageElement = dropZoneElement.querySelector('img');

		imageElement.parentElement.dataset.label = file.name;
		
		const [encodedAndCompressedImageURL] = await encodeImages([file], 300, 300);
		imageElement.src = encodedAndCompressedImageURL;
	}
}