import { html } from "../../lib/lit-html.js";

export const cardTemplate = (carObj, user, deleteClickHandler, likeClickHandler, approveClickHandler, needApproval, ctx) => html`
	<div class="card border-0">
		<img src=${carObj.images[0]} class="card-img-top" alt=${carObj.carName}>
		<div class="card-body">
			<h5 class="card-title">${carObj.carName}</h5>
			<p class="card-text"><b>Engine:</b> ${carObj.engineInfo} <b>|</b> <b>Power:</b> ${carObj.power} <b>|</b>
				<b>Top speed:</b> ${carObj.topSpeed} <b>|</b> <b>Weight:</b> ${carObj.weight}</p>
			<span class="post-actions">
				<a data-object-Id=${carObj.objectId} href="#" class="btn btn-primary show-more-info-btn">Show more info</a>
				${
					needApproval ?
					html`
						<button @click=${approveClickHandler} type="button" class="btn btn-success approve-btn">Approve</button>
						<button @click=${deleteClickHandler} type="button" class="btn btn-danger reject-btn">Reject</button>
					` :
					html`
						<span class="post-icons">
							${!user ? html`
								<span data-likes="${carObj.likesCount}" class="like-span">
										<img class="unactive-like" alt="like" src="/images/thumbs-up.svg">
								</span>	
							` : null}
							${user?.objectId === carObj.owner.objectId ? 
								html`
									<span data-likes="${carObj.likesCount}" class="like-span">
										<img class="unactive-like" alt="like" src="/images/thumbs-up.svg">
									</span>
									<img @click=${() => ctx.page.redirect(`/share-photos:${carObj.objectId}`)} class="edit" alt="edit" src="/images/edit.svg">
									<img @click=${deleteClickHandler} class="bin" alt="delete" src="/images/trash-2.svg">
								` : null
							}
							${user && user?.objectId !== carObj.owner.objectId ? 
								html`
								<span data-likes="${carObj.likesCount}" class="like-span">
									<img @click=${likeClickHandler} class="like${carObj.userHasLikedThisPost ? ' user-has-liked' : ''}" alt="like" src="/images/thumbs-up.svg">
								</span>
								` : null
							}
						</span>
					`
				}
			</span>
		</div>
	</div>
`