import { html } from "../../lib/lit-html.js";
import { repeat } from "../../lib/directives/repeat.js";
import { until } from "../../lib/directives/until.js";
import { getAllPosts } from "../../api/posts.js";
import { sectionClickHandler } from "./infoWindow.js";
import { setUpScrollToTop } from "./scrollToTop.js";
import { carPicturesTemplate } from "./carPicturesTemplate.js";
import { getDeleteHandler, getLikeClickHandler } from "./postActions.js";

export async function carPicturesView(ctx) {
	const cardTemplate = (carObj, user, binClickHandler, likeClickHandler) => html`
		<div class="card border-0">
			<img src=${carObj.images[0]} class="card-img-top" alt=${carObj.carName}>
			<div class="card-body">
				<h5 class="card-title">${carObj.carName}</h5>
				<p class="card-text"><b>Engine:</b> ${carObj.engineInfo} <b>|</b> <b>Power:</b> ${carObj.power} <b>|</b>
					<b>Top speed:</b> ${carObj.topSpeed} <b>|</b> <b>Weight:</b> ${carObj.weight}</p>
				<span class="post-actions">
					<a data-object-Id=${carObj.objectId} href="#" class="btn btn-primary show-more-info-btn">Show more info</a>
					<span class="post-icons">
						${!user ? html`
							<span data-likes="${carObj.likesCount}" class="like-span">
									<img class="unactive-like" alt="like" src="/images/thumbs-up.svg">
							</span>	
						` : null}
						${user?.id === carObj.owner.objectId ? 
							html`
								<span data-likes="${carObj.likesCount}" class="like-span">
									<img class="unactive-like" alt="like" src="/images/thumbs-up.svg">
								</span>
								<img @click=${() => ctx.page.redirect(`/share-photos:${carObj.objectId}`)} class="edit" alt="edit" src="/images/edit.svg">
								<img @click=${binClickHandler} class="bin" alt="delete" src="/images/trash-2.svg">
							` : null
						}
						${user && user.id !== carObj.owner.objectId ? 
							html`
							<span data-likes="${carObj.likesCount}" class="like-span">
								<img @click=${likeClickHandler} class="like${carObj.userHasLikedThisPost ? ' user-has-liked' : ''}" alt="like" src="/images/thumbs-up.svg">
							</span>
							` : null
						}
						${user && user.id !== carObj.owner.objectId ? 
							html`<img data-object-Id=${carObj.objectId} class="flag" alt="flag" src="/images/flag.svg">` : null
						}
					</span>
				</span>
			</div>
		</div>
	`

	const noPostsTemplate = () => {
		return ctx.user?.sessionToken ? 
		html`
			<h1 id="no-posts">There are no posts yet.<br><a @click=${() => ctx.page.redirect('/share-photos')} href="/share-photos">Create one!</a></h1>
		` :
		html`
			<h1 id="no-posts">There are no posts yet.<br><a @click=${() => ctx.page.redirect('/login')} href="/login">Log in</a> and create one!</h1>
		`
	}

	let posts = null;

	const getSectionContentTemplate = async (noPostsTemplate) => {
		posts = await getAllPosts(ctx);

		if (posts.length == 0) {
			ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'flex-start';
		}

		return html`
			${
				posts.length > 0 ? 
				repeat(posts, post => post.objectId, post => cardTemplate(
					post, ctx.user,
					getDeleteHandler(ctx, post.objectId),
					getLikeClickHandler(post.objectId, ctx.user?.id),
				)) : 
				noPostsTemplate
			}
		`
	}

	const loadingTemplate = () => html`
		<h1 id="loading">Loading posts<div class="loader">Loading...</div></h1>
	`

	ctx.render(carPicturesTemplate(
		ev => sectionClickHandler(ev, posts, ctx),
		until(getSectionContentTemplate(noPostsTemplate()), loadingTemplate())
	));

	setUpScrollToTop(ctx);
}