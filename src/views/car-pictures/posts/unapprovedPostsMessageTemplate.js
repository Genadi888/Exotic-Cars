import { getCountOfUnapprovedPostsOfUser } from "/src/api/posts.js";
import { html } from "/src/lib/lit-html.js";

const unapprovedPostsMessageTemplate = (count, closeHandler) => html`
	<div id="unapprovedPostsMessageContainer">
		<button @click=${closeHandler} type="button" class="btn-close" aria-label="Close"></button>

		<p>
			You have ${count} ${count == 1 ? 'post' : 'posts'} waiting for moderator approval.
		</p>
	</div>
`

export async function getUnapprovedPostsMessageTemplate(sectionContentPromise) {
	const countPromise = getCountOfUnapprovedPostsOfUser();

	//? Promise.all is used to avoid a race condition between the two promises.
	const count = (await Promise.all([sectionContentPromise, countPromise]))[1];

	const handler = ev => ev.currentTarget.parentElement.style.display = 'none';

	return count > 0 ? unapprovedPostsMessageTemplate(count, handler) : null;
}