import { getPostById } from "../../api/posts.js";
import { html } from "/src/lib/lit-html.js";

export const formTemplate = async (inputEventHandlers, formInputEventHandler, formSubmitEventHandler, postId) => {
	let post = null;
	if (postId) {
		post = await getPostById(postId);
	}
	
	return html`
		<link rel="stylesheet" href="/css/upload-form.css">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
			integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
		
		<form @submit=${formSubmitEventHandler} @input=${formInputEventHandler} class="grid-container">
			<div class="grid-item grid-item-1">
				<div class="drop-zone">
					<span class="drop-zone__prompt">Drop images here or click to upload<br>(4 maximum)</span>
					<!-- <div class="drop-zone__thumb" data-label="myFile.txt"></div> -->
					<input @change=${inputEventHandlers.imagesInputHandler} type="file" name="images" class="drop-zone__input"
						accept=".jpg,.jpeg,.png," multiple>
				</div>
			</div>
			<div class="grid-item grid-item-2">
				<label for="car-name">Car name:</label>
				<input .value=${post ? post.carName : ''} @input=${inputEventHandlers.getCarNameInputHandler()} class="form-control" type="text"
					placeholder="Mitsubishi Lancer Evolution X" aria-label="default input example" id="car-name" name="car-name"
					maxlength="40">
				<span class="invalid-span" id="first-invalid-span">Invalid name</span>
		
				<label for="engine-info">Engine info:</label>
				<input .value=${post ? post.engineInfo : ''} @input=${inputEventHandlers.getEngineInfoInputHandler()} class="form-control" type="text"
					placeholder="2.0 MIVEC FQ-360" aria-label="default input example" id="engine-info" name="engine-info"
					maxlength="30">
				<span class="invalid-span" id="second-invalid-span">Invalid engine info</span>
		
				<label for="power">Power:</label>
				<input .value=${post ? post.power : ''} @input=${inputEventHandlers.getPowerInfoInputHandler()} class="form-control" type="text"
					placeholder="359 Hp @ 6500 rpm" aria-label="default input example" id="power" name="power" maxlength="30">
				<span class="invalid-span" id="third-invalid-span">Invalid power info</span>
		
				<span id="top-speed-and-weight">
					<div id="top-speed-div">
						<input .value=${post ? post?.topSpeed.match(/\d+/)[0] : ''} @input=${inputEventHandlers.getTopSpeedInputHandler()} class="form-control" type="number"
							placeholder="Top speed" aria-label="default input example" name="top-speed">
						<span class="invalid-span" id="fourth-invalid-span">invalid speed</span>
					</div>
		
					<div class="radio-divs">
						<span>
							<input ?checked=${!post || post.topSpeed.match(/[A-Za-z\/]+/)[0] === 'km/h'} class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
								id="flexRadioDefault1" value="km/h">
							<label class="form-check-label" for="speed-unit">
								km/h
							</label>
						</span>
						<span>
							<input ?checked=${post?.topSpeed.match(/[A-Za-z\/]+/)[0] === 'mph'}  class="form-check-input speed-unit-radios" type="radio" name="speed-unit"
								id="flexRadioDefault1" value="mph">
							<label class="form-check-label" for="speed-unit">
								mph
							</label>
						</span>
					</div>
		
					<div id="weight-div">
						<input .value=${post ? post?.weight.match(/\d+/)[0] : ''} @input=${inputEventHandlers.getWeightInputHandler()} class="form-control" type="number"
							placeholder="Weight" aria-label="default input example" name="weight">
						<span class="invalid-span" id="fifth-invalid-span">invalid weight</span>
					</div>
		
					<div class="radio-divs">
						<span>
							<input ?checked=${!post || post.weight.match(/[A-Za-z\/]+/)[0] === 'kgs'} class="form-check-input weight-radios" type="radio" name="weight-unit"
								id="flexRadioDefault1" value="kgs">
							<label class="form-check-label" for="weight-unit">
								kgs
							</label>
						</span>
						<span>
							<input ?checked=${post?.weight.match(/[A-Za-z\/]+/)[0] === 'lbs'} class="form-check-input weight-radios" type="radio" name="weight-unit" id="flexRadioDefault1"
								value="lbs">
							<label class="form-check-label" for="weight-unit">
								lbs
							</label>
						</span>
					</div>
				</span>
			</div>
			<div class="grid-item grid-item-3">
				<div class="form-floating">
					<textarea .value=${post ? post.extraInfo : ''} @input=${inputEventHandlers.getExtraInfoInputHandler()} class="form-control extra-info"
						name="extra-info" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
					<label for="floatingTextarea">Extra info (optional)</label>
					<span class="invalid-span" id="textarea-invalid-span">Invalid extra info</span>
				</div>
				<input ?disabled=${!post} class="btn btn-primary" type="submit" value=${post ? 'Edit' : "Post"}>
			</div>
		</form>
	`;
}