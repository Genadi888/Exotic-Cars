const body = document.querySelector('body');

document.querySelector('section').addEventListener('click', ev => {
	ev.preventDefault();

	if (ev.target.classList.contains("btn-primary")) {
		const carName = ev.target.parentElement.querySelector('h5').textContent;

		if (!([...body.children].includes(infoWindow))) { //? ако прозореца не е прикачен към body, запълни го с нова информация
			fillInfo(carName);
		}
		showOrHideWindow();
	}
});

const carsObject = {
	'Ford GT 2005': {
		'Fuel Consumption': '30 l/100 km',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'Rear',
		'Transmission': 'manual, 6 gears',
		'Acceleration': '3.8 sec, 0 - 100 km/h',
		'Production': '2004 - 2006',
	},

	'Dodge Challenger III SRT Hellcat Redeye': {
		'Fuel Consumption': '18.1 l/100 km',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'Rear',
		'Transmission': 'automatic, 8 gears',
		'Acceleration': 'not measured',
		'Production': '2018 - ',
	},

	'BMW i8 Roadster': {
		'Fuel Consumption': '2 l/100 km',
		'Fuel Type': 'petrol / electricity',
		'Drive wheel': 'All (4x4)',
		'Transmission': 'automatic, 6 gears',
		'Acceleration': '4.6 sec, 0 - 100 km/h',
		'Production': '2018 - 2020',
	},

	'Lexus LC Convertible': {
		'Fuel Consumption': '15.7 l/100 km',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'Rear',
		'Transmission': 'automatic, 10 gears',
		'Acceleration': '4.6 sec, 0 - 60 mph',
		'Production': '2020 - ',
	},

	'Mercedes-Benz AMG GT (C190)': {
		'Fuel Consumption': '12.2 l/100 km',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'Rear',
		'Transmission': 'automatic, 7 gears',
		'Acceleration': '3.8 sec, 0 - 100 km/h',
		'Production': '2015 - 2017',
	},

	'Mitsubishi Lancer Evolution X': {
		'Fuel Consumption': '21.9 l/100 km',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'All (4x4)',
		'Transmission': 'manual, 5 gears',
		'Acceleration': '4.1 sec, 0 - 100 km/h',
		'Production': '2008 - 2014',
	},

	'Lamborghini Huracan Tecnica': {
		'Fuel Consumption': 'not measured',
		'Fuel Type': 'Petrol (Gasoline)',
		'Drive wheel': 'Rear',
		'Transmission': 'automatic, 7 gears',
		'Acceleration': '3.2 sec, 0 - 100 km/h',
		'Production': '2022 - ',
	},
}

const infoWindow = document.createElement('div');
infoWindow.id = 'more-info-window';
infoWindow.innerHTML = '<button onclick="showOrHideWindow()" type="button" class="btn-close" aria-label="Close"></button>';

const h4 = document.createElement('h4');
infoWindow.appendChild(h4);

function fillInfo(carName) {
	h4.textContent = carName;
	const curentCarObject = carsObject[carName];

	//? премахваме списъка, ако вече съществува
	const prevTable = infoWindow.querySelector('ul');
	if (prevTable !== null) {
		prevTable.remove();
	}

	const ul = document.createElement('ul');
	infoWindow.appendChild(ul);
	ul.appendChild(createLiElements('Fuel Consumption', curentCarObject['Fuel Consumption']));
	ul.appendChild(createLiElements('Fuel Type', curentCarObject['Fuel Type']));
	ul.appendChild(createLiElements('Drive wheel', curentCarObject['Drive wheel']));
	ul.appendChild(createLiElements('Transmission', curentCarObject['Transmission']));
	ul.appendChild(createLiElements('Acceleration', curentCarObject['Acceleration']));
	ul.appendChild(createLiElements('Production', curentCarObject['Production']));
}

function createLiElements(header, content) {
	const h6 = document.createElement('h6');
	h6.textContent = header + ":";

	const text = document.createElement('p');
	text.textContent = content;

	const li = document.createElement('li');
	li.appendChild(h6);
	li.appendChild(text);

	return li;
}

function showOrHideWindow() {
	if ([...body.children].includes(infoWindow)) { //? ако прозорецът е показан
		infoWindow.style.opacity = 0;
		setTimeout(() => {
			infoWindow.remove();
		}, 500);
	} else {
		setTimeout(() => {
			infoWindow.style.opacity = 1;
		}, 100);
		body.appendChild(infoWindow);
	}
}