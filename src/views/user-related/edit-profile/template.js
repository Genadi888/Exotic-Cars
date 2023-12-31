import { html } from "../../../lib/lit-html.js";

export const editProfileTemplate = (togglePasswordSection, emailInputHandler, usernameInputHandler, editProfileFormInputHandler, onSubmit, errorMsg, user) => html`
	<link rel="stylesheet" href="/css/edit-profile.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

	<main>
		<h1 id="main-header">Edit your profile</h1>

		<div id="edit-box-wrapper">
			<form @submit=${onSubmit} @input=${editProfileFormInputHandler} id="edit-box">
				<div id="edit-image">
					<input type="file" name="image" id="drop-zone-input" accept=".jpg,.jpeg,.png,">
					<label id="first-image-label">Click here to upload image</label>
					<div id="image-wrapper">
						<img src="${user?.profilePicture || "/images/user-pic.webp"}" alt="user-pic">
					</div>
					<label id="second-image-label">Drop image here</label>
				</div>
				${
					errorMsg ? html`<div id="error-div">${errorMsg}</div>` : null
				}
				<div id="username-div">
					<label for="username">Username:</label>
					<input @input=${usernameInputHandler} class="form-control" type="text" name="username">
					<span class="invalid-span" id="first-invalid-span"></span>
				</div>
				<a @click=${togglePasswordSection} href="#change-password" id="password-change-btn" class="btn">Request
					password reset?</a>
				<section class="password-change-section">
					<div id="email-div">
						<label for="email">Your email:</label>
						<input @input=${emailInputHandler} class="form-control" type="email" name="email">
						<span class="invalid-span" id="invalid-email-span"></span>
					</div>
				</section>
				<button disabled class="btn btn-primary" type="submit">Submit</button>
			</form>
		</div>
	</main>
`