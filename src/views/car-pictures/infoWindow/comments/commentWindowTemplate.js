import { commentTemplate } from "./commentTemplate.js";
import { getCommentsOfAPost } from "/src/api/comments.js";
import { repeat } from "/src/lib/directives/repeat.js";
import { until } from "/src/lib/directives/until.js";
import { html } from "/src/lib/lit-html.js";

export const getCommentWindowTemplate = (carObj, closeBtnHandler, publishCommentBtnHandler, commentsDivClickHandler, publishCommentInputHandler, ctx) => {
	// console.log(ctx)
	async function commentsTemplate() {
		let comments = null;

		try {
			comments = await getCommentsOfAPost(carObj.objectId);
			// console.log(comments)
		} catch (error) {
			alert(error);
		}

		if (comments.length > 0) {
			return html`${repeat(comments, comment => comment.objectId, comment => commentTemplate(comment, null, ctx))}`;
		} else {
			return html`<h1 id="no-comments-header">There are no comments for this post.</h1>`
		}

	}

	const commentsTemplatePromise = commentsTemplate();

	return [html`
		<button @click=${closeBtnHandler} type="button" class="btn-close" aria-label="Close"></button>
		<h4>${carObj.carName} - comments</h4>
		
		<div id="comment-section">
			<div id="comments" @click=${commentsDivClickHandler}>
				${until(commentsTemplatePromise, html`<div class="comments-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`)}
			</div>

			${
				ctx.user 
				? html`
					<span @input=${publishCommentInputHandler} id="publish-comment">
						<label for="comment-input">Comment:</label>
						<textarea class="form-control" id="comment-input" rows="3"></textarea>
						<span class="invalid-span" id="textarea-invalid-span">Invalid comment</span>
						<button disabled type="button" class="btn btn-primary" @click=${publishCommentBtnHandler}>Comment</button>
					</span>
				` : null
			}
		</div>
	`, commentsTemplatePromise];
}