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
}