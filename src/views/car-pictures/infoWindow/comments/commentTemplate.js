import { html } from "/src/lib/lit-html.js";

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

						<!-- data-object-Id is comment.idOfRepliedComment so that every reply of this reply is placed in the main comment's reply section -->
						${ctx.user ? html`
							<img src="/images/plus-square.svg" data-owner-Name="${comment.ownerName}" data-object-Id="${comment.idOfRepliedComment}" title="reply" alt="reply" class="comment-reply-btn">
						` : null}

						${ctx.user ? html`
							<img src="/images/more-horizontal.svg" data-object-Id="${comment.objectId}" title="more" alt="more" class="comment-more-btn">
						` : null}
					</div>

					<ul tabindex="1" class="extra-comment-actions">
						${ 
							ctx.user.objectId !== comment.owner.objectId ? 
							html`
								<li><button class="comment-report-btn btn btn-danger" data-object-Id="${comment.objectId}">Report</button></li>
							` :  
							html`
								<li><button class="comment-delete-btn btn btn-danger" data-object-Id="${comment.objectId}">Delete</button></li>
								<li><button class="comment-edit-btn btn" data-object-Id="${comment.objectId}">Edit</button></li>
							`
						}
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
						
						${ctx.user ? html`
							<img src="/images/plus-square.svg" data-object-Id="${comment.objectId}" title="reply" alt="reply" class="comment-reply-btn">
						` : null}

						${ctx.user ? html`
							<img src="/images/more-horizontal.svg" data-object-Id="${comment.objectId}" title="more" alt="more" class="comment-more-btn">
						` : null}
					</div>

					<ul tabindex="1" class="extra-comment-actions">
						${ 
							ctx.user.objectId !== comment.owner.objectId ? 
							html`
								<li><button class="comment-report-btn btn btn-danger" data-object-Id="${comment.objectId}">Report</button></li>
							` :  
							html`
								<li><button class="comment-delete-btn btn btn-danger" data-object-Id="${comment.objectId}">Delete</button></li>
								<li><button class="comment-edit-btn btn" data-object-Id="${comment.objectId}">Edit</button></li>
							`
						}
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