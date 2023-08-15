import { editUser, logout, resetPassword } from "../../api/users.js";
import { getUsernameInputHandler, bindForm, getEmailInputHandler, encodeImages } from "../../util.js";
import { addProfilePicSubmition } from "./profilePicSubmition.js";
import { editProfileTemplate } from "./template.js";

export function editProfileView(ctx) {
	render();

	function render(error) { //? error is optional
		ctx.render(
			editProfileTemplate(
				togglePasswordSection,
				getEmailInputHandler(),
				getUsernameInputHandler(),
				getEditProfileFormInputHandler(),
				bindForm(onSubmit),
				error,
			)
		);

		addProfilePicSubmition(ctx.nestedShadowRoot.querySelector('#edit-image'));
	}

	async function onSubmit({ username, email, image: imageFile }, form) {
		try {
			if (username || imageFile) {
				let imageURL = null;
				if (imageFile) {
					imageURL = (await encodeImages([imageFile], 300, 300))[0];
				}
				await editUser(username, imageURL);
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
			render(error);
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
				|| form.querySelector('input[name="email"]').value != ''
				|| form.querySelector('input[name="image"]').value != '';

				if (!form.querySelector('.is-invalid') && fieldIsNotEmpty) {
					submitBtn.removeAttribute('disabled');
				} else {
					submitBtn.disabled = true;
				}
			}, 1000)
		}
	}
}