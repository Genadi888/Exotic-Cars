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

export const commentWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>${carObj.carName} - comments</h4>
	
	<div id="comment-section">
		<div id="comments">
			<div class="comment">
				<div class="comment-user-info-wrapper">
					<div class="comment-user-info">
						<img src="/images/blank-profile-picture.webp" title="user-pic" alt="user-pic" class="comment-user-pic">
						<p class="comment-info">Genadi<br>1 hour ago</p>
					</div>
				</div>
				<div class="comment-text-wrapper">
					<input type="checkbox" id="overflow-control-btn">
					<p class="comment-text">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
						molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
						numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
						optio, eaque rerum!
					</p>
					<label for="overflow-control-btn">
						<span class="show-more-btn">Show more</span>
						<span class="show-less-btn">Show less</span>
					</label>
				</div>
				<div class="comment-actions-wrapper">
					<div class="comment-actions">
						<img src="/images/thumbs-up.svg" title="like" alt="like" class="comment-like-btn">
						<img src="/images/flag.svg" title="report" alt="report" class="comment-report-btn">
						<img src="/images/plus-square.svg" title="reply" alt="reply" class="comment-reply-btn">
					</div>
				</div>
				<!-- <button type="button" class="btn btn-primary comment-like-btn">Like</button> -->
				<!-- <button type="button" class="btn btn-danger comment-report-btn">Report</button> -->
			</div>
			<!-- <div class="comment">
				<img src="/images/blank-profile-picture.webp" title="user-pic" alt="user-pic" class="comment-user-pic">
				<p class="comment-info">Genadi<br>1 hour ago</p>
				<p class="comment-text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
					molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
					numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
					optio, eaque rerum!
				</p>
				<button class="comment-like-btn">Like</button>
				<button class="comment-report-btn">Report</button>
			</div> -->
		</div>
		<span id="publish-comment">
			<label for="comment-input">Comment:</label>
			<textarea class="form-control" id="comment-input" rows="3"></textarea>
			<button type="button" class="btn btn-primary">Comment</button>
		</span>
	</div>
`;