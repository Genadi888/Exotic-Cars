import { getCommentsOfAPost } from "../../api/comments.js";
import { repeat } from "../../lib/directives/repeat.js";
import { until } from "../../lib/directives/until.js";
import { html } from "../../lib/lit-html.js";

export const infoWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>${carObj.carName}</h4>
	<p id="extra-info">${carObj.extraInfo && carObj.extraInfo != '' ? carObj.extraInfo : 'Extra info has not been provided.'}</p>
`;

export const reportWindowTemplate = (clickHandler, onSubmit, getFormInputEventHandler, getInputHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>Report this post</h4>
	
	<form @input=${getFormInputEventHandler()} @submit=${onSubmit} id="report-form">
		<div class="form-floating">
			<textarea @input=${getInputHandler()} class="form-control report-reason"
				name="reason" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
			<label for="floatingTextarea">Write a report reason</label>
			<span class="invalid-span" id="textarea-invalid-span">Invalid report reason</span>
		</div>
		<input disabled class="btn btn-danger" type="submit" value="Report">
	</form>
`;

export const commentTemplate = (comment, needsToBeAReply, ctx) => {
	comment.updatedAt = new Date(comment.updatedAt).toDateString();

	if (needsToBeAReply === true) {
		return html`
			<div class="comment reply-comment" data-object-Id="${comment.objectId}">
				<div class="comment-user-info-wrapper">
					<div class="comment-user-info">
						<img src="/images/blank-profile-picture.webp" title="user-pic" alt="user-pic" class="comment-user-pic">
						<p class="comment-info">${comment.ownerName}<br>${comment.updatedAt}</p>
					</div>
				</div>
				<div class="comment-text-wrapper">
					<input type="checkbox" id="overflow-control-btn">
					<p class="comment-text ${comment.ownerNameOfRepliedComment !== 'undefined' ? 'comment-text-of-reply-to-reply' : ''}" data-owner-name-of-replied-comment="${comment.ownerNameOfRepliedComment !== 'undefined' ? comment.ownerNameOfRepliedComment : ''}">${comment.commentText}</p>
					<label for="overflow-control-btn">
						<span class="show-more-btn">Show more</span>
						<span class="show-less-btn">Show less</span>
					</label>
				</div>
				<div class="comment-actions-wrapper">
					<div class="comment-actions">
						<span class="comment-like-btn-span" data-likes="${comment.likesCount}">
							<img src="/images/thumbs-up.svg" data-object-Id="${comment.objectId}" data-owner-object-id="${comment.owner.objectId}" 
							title=${ctx.user?.objectId !== comment.owner.objectId ? (comment.userHasLikedThisComment ? "unlike" : "like") : ""} alt="like" 
							class="comment-like-btn ${comment.userHasLikedThisComment ? 'user-has-liked-comment' : ''} 
							${ctx.user?.objectId === comment.owner.objectId || !ctx.user ? 'disabled-comment-like-btn' : ''}">
						</span>
						<!-- <img src="/images/flag.svg" title="report" alt="report" class="comment-report-btn"> -->
						<!-- data-object-Id is comment.idOfRepliedComment so that every reply of this reply is placed in the main comment's reply section -->
						
						${ctx.user ? html`
							<img src="/images/plus-square.svg" data-owner-Name="${comment.ownerName}" data-object-Id="${comment.idOfRepliedComment}" title="reply" alt="reply" class="comment-reply-btn">
						` : null}

						${ctx.user ? html`
							<img src="/images/more-horizontal.svg" data-object-Id="${comment.objectId}" title="more" alt="more" class="comment-more-btn">
						` : null}
					</div>

					<ul tabindex="1" class="extra-comment-actions">
						<li class="comment-report-btn">Report</li>
						<li class="comment-delete-btn">Delete</li>
					</ul>
				</div>
			</div>
		`
	} else {
		return html`
			<div class="comment" data-object-Id="${comment.objectId}">
				<div class="comment-user-info-wrapper">
					<div class="comment-user-info">
						<img src="/images/blank-profile-picture.webp" title="user-pic" alt="user-pic" class="comment-user-pic">
						<p class="comment-info">${comment.ownerName}<br>${comment.updatedAt}</p>
					</div>
				</div>
				<div class="comment-text-wrapper">
					<input type="checkbox" id="overflow-control-btn">
					<p class="comment-text">${comment.commentText}</p>
					<label for="overflow-control-btn">
						<span class="show-more-btn">Show more</span>
						<span class="show-less-btn">Show less</span>
					</label>
				</div>
				<div class="comment-actions-wrapper">
					<div class="comment-actions">
						<span class="comment-like-btn-span" data-likes="${comment.likesCount}">
							<img src="/images/thumbs-up.svg" data-object-Id="${comment.objectId}" data-owner-object-id="${comment.owner.objectId}"
							title=${ctx.user?.objectId !== comment.owner.objectId ? (comment.userHasLikedThisComment ? "unlike" : "like") : ""} alt="like" 
							class="comment-like-btn ${comment.userHasLikedThisComment ? 'user-has-liked-comment' : ''} 
							${ctx.user?.objectId === comment.owner.objectId || !ctx.user ? 'disabled-comment-like-btn' : ''}">
						</span>
						<!-- <img src="/images/flag.svg" title="report" alt="report" class="comment-report-btn"> -->
						
						${ctx.user ? html`
							<img src="/images/plus-square.svg" data-object-Id="${comment.objectId}" title="reply" alt="reply" class="comment-reply-btn">
						` : null}

						${ctx.user ? html`
							<img src="/images/more-horizontal.svg" data-object-Id="${comment.objectId}" title="more" alt="more" class="comment-more-btn">
						` : null}
					</div>

					<ul tabindex="1" class="extra-comment-actions">
						<li class="comment-report-btn">Report</li>
						<li class="comment-delete-btn">Delete</li>
					</ul>
				</div>

				${
					comment.hasReplies ? html`
						<div class="comment-replies-wrapper">
							<h2 class="show-replies-lines">Show replies</h2>
				
							<div class="comment-replies"></div>
						</div>
					` : null
				}
			</div>
		`;
	}
} 

export const getCommentWindowTemplate = (carObj, closeBtnHandler, publishCommentBtnHandler, commentsDivClickHandler, publishCommentInputHandler, ctx) => {
	console.log(ctx)
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