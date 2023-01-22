import { login, resetPassword } from "../api/users.js";
import { html } from "../lib/lit-html.js";
import { getPasswordInputHandler, getUsernameInputHandler, bindForm } from "../util.js";

const loginTemplate = (getUsernameInputHandler, getPasswordInputHandler, getEmailInputHandler, onSubmit, onForgotPasswordClick, resetPass, error) => html`
	<link rel="stylesheet" href="/css/login.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

	<main>
		<form @submit=${onSubmit}>
			<h1>Log in</h1>
			${error ? html`<span class="server-error-msg">${error}</span>` : null}
			<div class="inputs">
				<label for="username">Username:</label>
				<input @input=${getUsernameInputHandler()} class="form-control" type="text" name="username" id="username">
				<span class="invalid-span" id="first-invalid-span"></span>
				
				<label for="password">Password:</label>
				<input @input=${getPasswordInputHandler()} class="form-control" type="password" name="password" id="password">
				<span class="invalid-span" id="second-invalid-span"></span>
				
				<div class="form-check">
					<input class="form-check-input remember-me" type="checkbox" value="" id="flexCheckChecked">
					<label class="form-check-label" for="flexCheckChecked">
						Remember me
					</label>
				</div>

				<span class="redirect-span">Don't have an account? <a href="/register">Register!</a></span>
				<br>
				<a @click=${onForgotPasswordClick} class="forgot-password" href="javascript:void(0)">Forgot your password?</a>
				<div class="password-reset-div">
					<label for="email">Email:</label>
					<div class="input-and-button">
						<input @input=${getEmailInputHandler()} class="form-control" type="email" name="email" id="email">
						<button @click=${resetPass} disabled type="button" class="btn btn-primary">Submit</button>
					</div>
					<span class="invalid-span" id="third-invalid-span"></span>
				</div>
				<input class="btn btn-primary" type="submit" value="Log in">
			</div>
		</form>
	</main>
`

export function loginView(ctx) {
	ctx.render(
		loginTemplate(
			getUsernameInputHandler,
			getPasswordInputHandler,
			getEmailInputHandler,
			bindForm(onSubmit),
			onForgotPasswordClick,
			onResetPasswordBtnClick
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
					getUsernameInputHandler,
					getPasswordInputHandler,
					getEmailInputHandler,
					bindForm(onSubmit),
					onForgotPasswordClick,
					onResetPasswordBtnClick,
					error.message
				)
			);
		}
	}

	function onForgotPasswordClick(ev) {
		const div = ev.currentTarget.parentElement.querySelector('.password-reset-div');
		div.style.display = div.style.display == '' || div.style.display == 'none'? 'block' : 'none';
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

	function getEmailInputHandler() {
		let timeout;
	
		return ev => {
			clearTimeout(timeout);
	
			const inputEl = ev.currentTarget;
			const span = inputEl.parentElement.parentElement.querySelector('#third-invalid-span');
			const submitBtn = inputEl.parentElement.querySelector('.btn-primary');
			submitBtn.disabled = true;
			const email = inputEl.value.trim();
	
			timeout = setTimeout(() => {
				if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'invalid email';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
					submitBtn.removeAttribute('disabled');
				}
			}, 1000)
		}
	}
}