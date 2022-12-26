import { defineUploadForm } from "../components/upload-form/upload-form.js";
import { html } from "../lib/lit-html.js";

const sharePhotosTemplate = () => html`
	<link rel="stylesheet" href="/css/share-photos.css">

	<main>
		<h1>
			Share your photos with the community!
		</h1>
	
		<upload-form></upload-form>
	</main>
`

export function sharePhotosView(ctx) {
	defineUploadForm(ctx);
	ctx.render(sharePhotosTemplate());
}