document.querySelector('section').addEventListener('click', ev => {
	ev.preventDefault();
	if (ev.target.classList.contains("btn-primary")) {
		showOrHideInfo();
	}
});


const body = document.querySelector('body');
const div = document.createElement('div');
div.id = 'more-info-window';
div.innerHTML = '<button onclick="showOrHideInfo()" type="button" class="btn-close" aria-label="Close"></button>';

function showOrHideInfo() {
	if ([...body.children].includes(div)) {
		div.remove();
	} else {
		body.appendChild(div);
	}
}