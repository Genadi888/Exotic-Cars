const inputElement = document.querySelector('.drop-zone__input');
const dropZoneElement = inputElement.closest('.drop-zone');

dropZoneElement.addEventListener('dragover', el => {
	dropZoneElement.classList.add('drop-zone--over');
});

//? here I am adding event listeners for the "dragleave" and "dragend" events
['dragleave', 'dragend'].forEach(type => {
	dropZoneElement.addEventListener(type, el => {
		dropZoneElement.classList.remove('drop-zone--over');
	});
});