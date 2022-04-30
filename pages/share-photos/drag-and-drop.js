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

	let filesArr = Array.from(el.dataTransfer.files);
	// for (const file of el.dataTransfer.files) {
	// 	filesArr.push(file)
	// }
	filesArr = filesArr.filter(file => file.type.startsWith('image/'));
	console.log(filesArr);
	
	if (filesArr.length) {
		console.log(inputElement.files);
		new FileList()
		inputElement.files = filesArr;
		updateThumbnail(dropZoneElement, filesArr);
	}

	dropZoneElement.classList.remove('drop-zone--over');
});

/** 
	* @param {HTMLElement} dropZoneElement
	* @param {File} firstFile
*/

function updateThumbnail(dropZoneElement, filesArr) {
	const firstFile = filesArr[0];
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
	label = label.slice(0, -2);
	thumbnailElement.dataset.label = label;

	//? Show thumbnail for image files only
	if (firstFile.type.startsWith('image/')) {
		const reader = new FileReader();

		reader.readAsDataURL(firstFile);
		reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url(${reader.result})`;
		}
	} else {
		thumbnailElement.style.backgroundImage = null;
	}
}