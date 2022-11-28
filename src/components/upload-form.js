import { html, render as litRender } from "../lib/lit-html.js";

export function defineUploadForm() {
	class UploadForm extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}
		
		connectedCallback() {
			console.log('hey')
			litRender(html`
				<link rel="stylesheet" href="/css/upload-form.css">
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
					integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
				
				<form class="grid-container">
					<div class="grid-item grid-item-1"><img src="Jaguar-E-Type.jpg" alt="Jaguar-E-Type"></div>
					<div class="grid-item grid-item-2">
						<input class="form-control" type="text" placeholder="Car name" aria-label="default input example" type="text"
							name="car-name" placeholder="Car name">
						<input class="form-control" type="text" placeholder="Engine info" aria-label="default input example" type="text"
							name="engine-info" placeholder="Engine info">
						<input class="form-control" type="text" placeholder="Power" aria-label="default input example" type="text"
							name="power" placeholder="Power">
						<span id="top-speed-and-weight">
							<input class="form-control" type="number" placeholder="Top speed" aria-label="default input example"
								type="number" name="top-speed" placeholder="Top speed">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input" type="radio" name="speed-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										km/h
									</label>
								</span>
								<span>
									<input class="form-check-input" type="radio" name="speed-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										mph
									</label>
								</span>
							</div>
							<input class="form-control" type="number" placeholder="Weight" aria-label="default input example"
								type="number" name="weight" placeholder="Weight">
							<div class="radio-divs">
								<span>
									<input checked class="form-check-input" type="radio" name="weight-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										kgs
									</label>
								</span>
								<span>
									<input class="form-check-input" type="radio" name="weight-unit" id="flexRadioDefault1">
									<label class="form-check-label" for="defaultCheck1">
										lbs
									</label>
								</span>
							</div>
						</span>
					</div>
					<div class="grid-item grid-item-3">
						<div class="form-floating">
							<textarea class="form-control extra-info" placeholder="Leave a comment here"
								id="floatingTextarea"></textarea>
							<label for="floatingTextarea">Extra info (optional)</label>
						</div>
						<input class="btn btn-primary" type="submit" value="Submit">
					</div>
				</form>
			`, this.shadowRoot);
		}
	}

	if (window.customElements.get('upload-form') == undefined) {
		window.customElements.define('upload-form', UploadForm);
	}
}