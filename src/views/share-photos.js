import { defineCreateUploadForm } from "../components/upload-form/upload-form.js";
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
	defineCreateUploadForm(ctx);
	ctx.render(sharePhotosTemplate());
	
	ctx.controller = new AbortController();
	
	ctx.topShadowRoot.querySelector('.navbar').addEventListener('click', ev => {
		if (!confirm('You may have unsaved changes. Proceed?')) {
			ev.preventDefault(); //? don't let the link change the url
		}
	}, { signal: ctx.controller.signal});

	window.addEventListener('beforeunload', (ev) => {
		ev.preventDefault();
  		return ev.returnValue = 'You may have unsaved changes. Proceed?';
	}, { signal: ctx.controller.signal});

	// window.addEventListener('popstate', popStateListener);

	// function popStateListener(event) {
	// 	console.log(event)
	// 	event.preventDefault()
	// 	event.stopImmediatePropagation()
	// 	// ctx.page.stop();
	// 	// console.log(ctx.page)
	// 	// ctx.page.start();
	// 	// this.history.replaceState(null, null, '/share-photos')
	// 	// page.start();
	// }

	// ctx.popStateListener = popStateListener;
}