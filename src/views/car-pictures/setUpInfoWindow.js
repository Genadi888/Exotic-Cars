import { html, render as litRender } from "../../lib/lit-html.js";

const infoWindowTemplate = (carName) => {
	const curentCarObject = carsObject[carName];

	return html`
		<button @click=${showOrHideWindow} type="button" class="btn-close" aria-label="Close"></button>
		<h4>${carName}</h4>
		<ul>
			<li>
				<h6>Fuel Consumption:</h6>
				<p>${curentCarObject['Fuel Consumption']}</p>
			</li>
			<li>
				<h6>Fuel Type:</h6>
				<p>${curentCarObject['Fuel Type']}</p>
			</li>
			<li>
				<h6>Drive wheel:</h6>
				<p>${curentCarObject['Drive wheel']}</p>
			</li>
			<li>
				<h6>Transmission:</h6>
				<p>${curentCarObject['Transmission']}</p>
			</li>
			<li>
				<h6>Acceleration:</h6>
				<p>${curentCarObject['Acceleration']}</p>
			</li>
			<li>
				<h6>Production:</h6>
				<p>${curentCarObject['Production']}</p>
			</li>
		</ul>
	`
};

function showOrHideWindow() {
	const infoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

	if (+infoWindow.style.opacity == 0) {
		infoWindow.style['z-index'] = 1;
		infoWindow.style.opacity = 1;
	} else {
		infoWindow.style.opacity = 0;
		infoWindow.addEventListener('transitionend', ev => {
			if (ev.propertyName == 'opacity' && infoWindow.style.opacity == 0) {
				infoWindow.style['z-index'] = -1;
			}
		});
	}
}

export function sectionClickHandler(ev) {
	ev.preventDefault();

	if (ev.target.classList.contains("show-more-info-btn")) {
		const carName = ev.target.parentElement.querySelector('h5').textContent;

		litRender(infoWindowTemplate(carName), ctx.nestedShadowRoot.querySelector('#more-info-window'));
		showOrHideWindow();
	}
}