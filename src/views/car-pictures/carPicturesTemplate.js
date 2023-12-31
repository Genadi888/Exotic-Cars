import { html } from "../../lib/lit-html.js";

export const carPicturesTemplate = (sectionClickHandler, postsTemplate, onSwitchToApprovalMode, unapprovedPostsMessageTemplatePromise, searchHandler, ctx, searchMode) => html`
	<link rel="stylesheet" href="/css/car-pictures.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<a id="go-to-top-link"><img src="../../images/arrow-up-circle.svg" alt="" srcset=""></a>

	<section @click=${sectionClickHandler}>
		<div id="aboveTopLineDiv">
			${
				onSwitchToApprovalMode ?
				html`
					<button @click=${onSwitchToApprovalMode} type="button" class="approval-btn btn btn-primary">Switch to ${ctx.hash == 'approval-mode' ? 'normal' : 'approval'} mode</button>
				` : null
			}
			<form @submit=${searchHandler} class="input-group mb-3">
				<input id="postsSearchInput" type="text" class="form-control" placeholder="Search for a title, extra info, owner name ..." aria-label="Recipient's username" aria-describedby="button-addon2">
				<button class="btn btn-primary" type="submit" id="button-addon2">Search</button>
				${
					searchMode ?
					html`<a href="/car-pictures${window.location.hash}" class="btn btn-secondary" type="submit">Go back</a>`
					: null
				}
				
			</form>
		</div>
		<hr id="button-and-posts-separating-line">
		${unapprovedPostsMessageTemplatePromise}
		${postsTemplate}
	</section>
	
	<div id="more-info-window"></div>
`