const inputElement = document.querySelector('.drop-zone__input');
const dropZoneElement = inputElement.closest('.drop-zone');

dropZoneElement.addEventListener('click', el => {
	inputElement.click();
});

inputElement.addEventListener('change', el => {
	if (inputElement.files.length) {
		updateThumbnail(dropZoneElement, inputElement.files);
	}
});

dropZoneElement.addEventListener('dragover', el => {
	el.preventDefault();
	dropZoneElement.classList.add('drop-zone--over');
});

//? here I am adding event listeners for the "dragleave" and "dragend" events
['dragleave', 'dragend'].forEach(type => {
	dropZoneElement.addEventListener(type, el => {
		dropZoneElement.classList.remove('drop-zone--over');
	});
});

dropZoneElement.addEventListener('drop', el => {
	el.preventDefault();

	const filesArr = Array.from(el.dataTransfer.files).filter(file => file.type.startsWith('image/'));

	const dataTransfer = new DataTransfer();
	filesArr.forEach(file => dataTransfer.items.add(file));

	if (filesArr.length) {
		inputElement.files = dataTransfer.files;
		updateThumbnail(dropZoneElement, inputElement.files);
	}

	dropZoneElement.classList.remove('drop-zone--over');
});

/** 
	* @param {HTMLElement} dropZoneElement
	* @param {File} firstFile
*/

function updateThumbnail(dropZoneElement, files) {
	const filesArr = [];

	for (const file of files) {
		filesArr.push(file);
	}
	
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
	label = label.slice(0, -2);  //? here the last comma and space string is excluded from the final label
	thumbnailElement.dataset.label = label;

	const reader = new FileReader();
	reader.readAsDataURL(filesArr[0]);
	reader.onload = () => {
		thumbnailElement.style.backgroundImage = `url(${reader.result})`;
	}
}