import { editUser, logout, resetPassword } from "../api/users.js";
import { html } from "../lib/lit-html.js";
import { getUsernameInputHandler, bindForm, getEmailInputHandler } from "../util.js";

const editProfileTemplate = (togglePasswordSection, emailInputHandler, usernameInputHandler, editProfileFormInputHandler, onSubmit, errorMsg) => html`
	<link rel="stylesheet" href="/css/edit-profile.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<main>
		<div id="edit-box-wrapper">
			<form @submit=${onSubmit} @input=${editProfileFormInputHandler} id="edit-box">
				<div id="edit-image">
					<img src="/images/user-pic.webp" alt="user-pic">
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

export function editProfileView(ctx) {
	ctx.render(
		editProfileTemplate(
			togglePasswordSection,
			getEmailInputHandler(),
			getUsernameInputHandler(),
			getEditProfileFormInputHandler(),
			bindForm(onSubmit),
		)
	);

	async function onSubmit({ username, email }, form) {
		try {
			if (username) {
				await editUser(username);
			}

			if (email) {
				if (email != ctx.user.email) {
					throw new Error('You have not entered your email!');
				}

				await resetPassword(email);
			}

			form.reset();
			await logout();
			alert('You need to log in again.')
			ctx.page.redirect('/login');
		} catch (error) {
			ctx.render(
				editProfileTemplate(
					togglePasswordSection,
					getEmailInputHandler(),
					getUsernameInputHandler(),
					getEditProfileFormInputHandler(),
					bindForm(onSubmit),
					error.message,
				)
			);
			throw error;
		}
	}
	
	if (window.location.hash == '#change-password') {
		togglePasswordSection();
	}
	
	function togglePasswordSection(ev) {
		ev?.preventDefault();

		const section = ctx.nestedShadowRoot.querySelector('.password-change-section');
		section.classList.toggle('active');

		const passwordBtn = ctx.nestedShadowRoot.querySelector('#password-change-btn');

		if (section.classList.contains('active')) {
			history.pushState(null, null, '#change-password');
			passwordBtn.href = '#';
			passwordBtn.textContent = 'Close';
		} else {
			history.pushState(null, null, '#');
			passwordBtn.href = '#change-password';
			passwordBtn.textContent = 'Request password reset?';
		}
	}

	function getEditProfileFormInputHandler() {
		let timeout;

		return ev => {
			clearTimeout(timeout);

			const form = ev.currentTarget;
			const submitBtn = form.querySelector('button[type="submit"]');
			submitBtn.disabled = true;

			timeout = setTimeout(() => {
				const fieldIsNotEmpty = form.querySelector('input[name="username"]').value != '' 
				|| form.querySelector('input[name="email"]').value != '';

				if (!form.querySelector('.is-invalid') && fieldIsNotEmpty) {
					submitBtn.removeAttribute('disabled');
				}
				else {
					submitBtn.disabled = true;
				}
			}, 1000)
		}
	}
}