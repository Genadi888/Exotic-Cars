import { html } from "../../lib/lit-html.js";

export const carPicturesTemplate = (sectionClickHandler, postsTemplate, onSwitchToApprovalMode, unapprovedPostsMessageTemplatePromise) => html`
	<link rel="stylesheet" href="/css/car-pictures.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<a id="go-to-top-link"><img src="../../images/arrow-up-circle.svg" alt="" srcset=""></a>

	<section @click=${sectionClickHandler}>
		${
			onSwitchToApprovalMode ?
			html`
				<button @click=${onSwitchToApprovalMode} type="button" class="approval-btn btn btn-primary">Switch to approval mode</button>
				<hr id="button-and-posts-separating-line">
			` : null
		}
		${unapprovedPostsMessageTemplatePromise}
		${postsTemplate}
	</section>
	
	<div id="more-info-window"></div>
`