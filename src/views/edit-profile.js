import { html } from "../lib/lit-html.js";

const editProfileTemplate = (togglePasswordSection) => html`
	<link rel="stylesheet" href="/css/edit-profile.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<main>
		<div id="edit-box-wrapper">
			<form id="edit-box">
				<div id="edit-image">
					<img src="/images/user-pic.webp" alt="user-pic">
				</div>
				<div id="username-div">
					<label for="username">Username:</label>
					<input class="form-control" type="text" name="username">
				</div>
				<a @click=${togglePasswordSection} href="#change-password" id="password-change-btn" class="btn">Change password?</a>
				<section class="password-change-section">
					<div id="old-password-div">
						<label for="old-password">Old password:</label>
						<input class="form-control" type="password" name="old-password">
					</div>
					<div id="new-password-div">
						<label for="new-password">New password:</label>
						<input class="form-control" type="password" name="new-password">
					</div>
				</section>
				<button class="btn btn-primary" type="submit">Save changes</button>
			</form>
		</div>
	</main>
`

export function editProfileView(ctx) {
	ctx.render(editProfileTemplate(togglePasswordSection));
	
	if (ctx.hash == 'change-password') {
		togglePasswordSection();
	}

	function togglePasswordSection(ev) {
		ev?.preventDefault();

		const section = ctx.nestedShadowRoot.querySelector('.password-change-section');
		section.classList.toggle('active');

		const passwordBtn = ctx.nestedShadowRoot.querySelector('#password-change-btn');

		if (section.classList.contains('active')) {
			window.location.href = '#change-password';
			passwordBtn.textContent = 'Close';
		} else {
			window.location.href = '#';
			passwordBtn.textContent = 'Change password?';
		}
	}
}