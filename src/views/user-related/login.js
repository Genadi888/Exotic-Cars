import { login, resetPassword } from "../../api/users.js";
import { html } from "../../lib/lit-html.js";
import { bindForm } from "../../util.js";

const loginTemplate = (emailInputHandler, onSubmit, onForgotPasswordClick, resetPass, formInputHandler, error) => html`
	<link rel="stylesheet" href="/css/login.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	
	<main>
		<form @input=${formInputHandler} @submit=${onSubmit}>
			<h1>Log in</h1>
			${error ? html`<span class="server-error-msg">${error}</span>` : null}
			<div class="inputs">
				<label for="username">Username:</label>
				<input class="form-control" type="text" name="username" id="username">
				<span class="invalid-span" id="first-invalid-span"></span>
	
				<label for="password">Password:</label>
				<input class="form-control" type="password" name="password" id="password">
				<span class="invalid-span" id="second-invalid-span"></span>
	
				<div class="form-check">
					<input class="form-check-input remember-me" type="checkbox" value="" id="flexCheckChecked">
					<label class="form-check-label" for="flexCheckChecked">
						Remember me
					</label>
				</div>
	
				<span class="redirect-span">Don't have an account? <a href="/register">Register!</a></span>
				<br>
				<a @click=${onForgotPasswordClick} class="forgot-password" href="javascript:void(0)">Forgot your
					password?</a>
				<div class="password-reset-div">
					<label for="email">Email:</label>
					<div class="input-and-button">
						<input @input=${emailInputHandler} class="form-control" type="email" name="email" id="email">
						<button @click=${resetPass} disabled type="button" class="btn btn-primary">Submit</button>
					</div>
					<span class="invalid-span" id="third-invalid-span"></span>
				</div>
				<input disabled class="btn btn-primary" type="submit" value="Log in">
			</div>
		</form>
	</main>
`

export function loginView(ctx) {
	ctx.render(
		loginTemplate(
			getEmailInputHandler(),
			bindForm(onSubmit),
			onForgotPasswordClick,
			onResetPasswordBtnClick,
			formInputHandler,
		)
	);

	async function onSubmit({ username, password, remember }, form) {
		try {
			await login(username, password, remember);
			form.reset();
			ctx.page.redirect('/');
		} catch (error) {
			ctx.render(
				loginTemplate(
					getEmailInputHandler(),
					bindForm(onSubmit),
					onForgotPasswordClick,
					onResetPasswordBtnClick,
					formInputHandler,
					error.message
				)
			);
			ctx.nestedShadowRoot.querySelector('#password').value = '';
		}
	}

	function onForgotPasswordClick(ev) {
		const div = ev.currentTarget.parentElement.querySelector('.password-reset-div');
		const emailInput = div.querySelector('input[type="email"]');

		const divStyles = getComputedStyle(div);

		if (divStyles.display == 'block') {
			emailInput.value = '';

			//? we dispatch this event in order to trigger the form's input listener and unlock the submit button
			emailInput.dispatchEvent(new Event("input", { bubbles: true, cancelable: true })); 
			
			div.style.display = 'none';
		} else {
			div.style.display = 'block';
		}
	}

	async function onResetPasswordBtnClick(ev) {
		const btn = ev.currentTarget;
		btn.disabled = true;
		const emailInput = ev.currentTarget.parentElement.querySelector('input[type="email"]');

		try {
			await resetPassword(emailInput.value);
			emailInput.value = '';
			btn.parentElement.parentElement.style.display = 'none';
		} catch (error) {
			alert(error.message);
		}
	}

	let emailInputHandlerTimeoutPromiseResolve = null;
	let emailInputHandlerTimeoutPromise = null;

	function getEmailInputHandler() {
		let timeout;

		return ev => {
			clearTimeout(timeout);

			emailInputHandlerTimeoutPromise = new Promise((resolve) => {
				emailInputHandlerTimeoutPromiseResolve = resolve;
			})

			const inputEl = ev.currentTarget;
			const span = inputEl.parentElement.parentElement.querySelector('#third-invalid-span');
			const submitBtn = inputEl.parentElement.querySelector('.btn-primary');
			submitBtn.disabled = true;
			const email = inputEl.value.trim();

			timeout = setTimeout(() => {
				emailInputHandlerTimeoutPromiseResolve()

				if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/) && email !== '') {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'invalid email';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';

					if (email !== '') {
						submitBtn.removeAttribute('disabled');
					}
				}
			}, 1000)
		}
	}

	async function formInputHandler(ev) {
		if (ev.target.type == 'checkbox') {
			return;
		}
		
		const form = ev.currentTarget;

		const submitBtn = form.querySelector('input[type="submit"]');
		submitBtn.disabled = true;

		const passwordResetDiv = form.querySelector(".password-reset-div");
		if (getComputedStyle(passwordResetDiv).display !== 'none') {
			//? If passwordResetDiv is visible, we wait for the email input handler validation.
			await emailInputHandlerTimeoutPromise;
		}

		const fieldsAreNotEmpty = [...form.querySelectorAll('input#username, input#password')]
			.every(el => el.value !== '');
		const hasInvalid = Boolean(form.querySelector('.is-invalid'));

		if (hasInvalid || !fieldsAreNotEmpty) {
			submitBtn.disabled = true;
		} else {
			submitBtn.removeAttribute('disabled');
		}
	}
}