import { html } from "../../../lib/lit-html.js";
import { repeat } from "../../../lib/directives/repeat.js";
import { cardTemplate } from "./cardTemplate.js";
import { getApproveClickHandler, getDeleteHandler, getLikeClickHandler } from "./postActions.js";

export async function getSectionContentTemplate (getNoPostsTemplate, postsType, posts, generatorsObject, ctx) {
	try {
		if (postsType == 'unapproved') {
			posts = await getAllUnapprovedPosts();
		} else {
			const generatorReturnedObject = await generatorsObject.asyncPostsGenerator.next();
			console.log(generatorReturnedObject)
			generatorsObject.asyncPostsGeneratorIsDone = generatorReturnedObject.done;
			if (generatorsObject.asyncPostsGeneratorIsDone) {
				return null;
			}

			const twoPosts = generatorReturnedObject.value;

			for (const post of twoPosts) {
				posts.push(post);
			}
		}
	} catch (error) {
		alert(error.message);
		throw error;
	}
	
	if (posts.length == 0) {
		ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'flex-start';
	}

	return html`
		${
			posts.length > 0 ? 
			repeat(posts, post => post.objectId, post => cardTemplate(
				post, 
				ctx.user,
				getDeleteHandler(ctx, post.objectId),
				getLikeClickHandler(post.objectId, ctx.user?.objectId),
				getApproveClickHandler(post.objectId, ctx.nestedShadowRoot.querySelector('section > .approval-btn')),
				postsType == 'unapproved'
			)) : 
			getNoPostsTemplate(postsType !== 'unapproved', ctx)
		}
	`
}