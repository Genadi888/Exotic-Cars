let hoveredOverProfileTools = false;
let workerExists = false;

export function pictureMouseOverHandler(ev) {
	const toolsList = ev.currentTarget.parentElement.querySelector('.profile-tools');
	toolsList.style.transition = 'opacity ease-in-out 200ms';
	toolsList.classList.add('profile-tools-active');
}

export function pictureMouseLeaveHandler(ev) {
	const picture = ev.currentTarget;

	if (workerExists) {
		return;
	}

	//? We assign the intensive task of creating a timeout to the worker.
	const worker = new Worker('/src/middlewares/render/timeoutWorker.js');
	workerExists = true;

	worker.addEventListener('message', () => {
		//? We will recieve a message from the worker after the tiomeout has ended.
		if (!hoveredOverProfileTools) {
			picture.parentElement.querySelector('.profile-tools').classList.remove('profile-tools-active');
		}
		worker.terminate();
		workerExists = false;
	});
}

export function profileToolsMouseEnterHandler() {
	hoveredOverProfileTools = true;
}

export function profileToolsMouseLeaveHandler(ev) {
	ev.currentTarget.classList.remove('profile-tools-active');
	hoveredOverProfileTools = false;
}

export function profileToolsMouseClickHandler(ev) {
	ev.currentTarget.classList.remove('profile-tools-active');
	hoveredOverProfileTools = false;
}