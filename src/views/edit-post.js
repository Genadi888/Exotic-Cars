import { defineEditUploadForm } from "../components/upload-form/upload-form.js";
import { html } from "../lib/lit-html.js";

const editPostTemplate = () => html`
	<link rel="stylesheet" href="/css/share-photos.css">

	<main>
		<h1>
			Edit your post
		</h1>
	
		<edit-upload-form></edit-upload-form>
	</main>
`

export function editPostView(ctx) {
	defineEditUploadForm(ctx);
	ctx.render(editPostTemplate());
	
	ctx.controller = new AbortController();
	
	ctx.topShadowRoot.querySelector('.navbar').addEventListener('click', ev => {
		if (sessionStorage.getItem('userHasUnsavedData')) {
			if (!confirm('You may have unsaved changes. Proceed?')) {
				ev.preventDefault(); //? don't let the link change the url
			}
		}
	}, { signal: ctx.controller.signal});

	window.addEventListener('beforeunload', (ev) => {
		ev.preventDefault();
  		return ev.returnValue = 'You may have unsaved changes. Proceed?';
	}, { signal: ctx.controller.signal});
}