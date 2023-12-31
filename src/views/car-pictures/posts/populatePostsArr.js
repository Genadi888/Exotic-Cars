import { html } from "/src/lib/lit-html.js";
import { getNoPostsTemplate } from './getNoPostsTemplate.js'

export async function populatePostsArr (ctx, posts, generatorsObject, postsType, initialPopstateChanges, prevWindowPath, arrOfPostObjectIdsHasItems) {
	if (postsType == 'unapproved') {
		if (arrOfPostObjectIdsHasItems) {
			const generatorReturnedObject = await generatorsObject.asyncUnapprovedSearchPostsGenerator.next();

			generatorsObject.asyncUnapprovedSearchPostsGeneratorIsDone = generatorReturnedObject.done;
			const currPopstateChanges = Number(sessionStorage.getItem('popstateChanges') || 0);
			
			let curWindowPath = window.location.href.replace(window.location.origin, '');
			curWindowPath = window.location.hash ? curWindowPath : curWindowPath.replace("#", '');

			if (generatorReturnedObject.value?.length > 0) {
				const twoPosts = generatorReturnedObject.value;

				if ((currPopstateChanges > initialPopstateChanges) || ((curWindowPath !== prevWindowPath) && prevWindowPath.startsWith('/car-pictures'))) {
					return Promise.reject("view changed");
				}

				posts.push(...twoPosts);
			} else {
				return html`${getNoPostsTemplate(postsType !== 'unapproved', ctx, true)}`
			}
		} else {
			const generatorReturnedObject = await generatorsObject.asyncUnapprovedPostsGenerator.next();

			generatorsObject.asyncUnapprovedPostsGeneratorIsDone = generatorReturnedObject.done;
			const currPopstateChanges = Number(sessionStorage.getItem('popstateChanges') || 0);
			
			let curWindowPath = window.location.href.replace(window.location.origin, '');
			curWindowPath = window.location.hash ? curWindowPath : curWindowPath.replace("#", '');

			if (generatorReturnedObject.value?.length > 0) {
				const twoPosts = generatorReturnedObject.value;

				if ((currPopstateChanges > initialPopstateChanges) || ((curWindowPath !== prevWindowPath) && prevWindowPath.startsWith('/car-pictures'))) {
					return Promise.reject("view changed");
				}

				posts.push(...twoPosts);
			}
		}
	} else {
		if (arrOfPostObjectIdsHasItems) {
			const generatorReturnedObject = await generatorsObject.asyncSearchPostsGenerator.next();
			generatorsObject.asyncSearchPostsGeneratorIsDone = generatorReturnedObject.done;
			const currPopstateChanges = Number(sessionStorage.getItem('popstateChanges') || 0);
			
			let curWindowPath = window.location.href.replace(window.location.origin, '');
			curWindowPath = window.location.hash ? curWindowPath : curWindowPath.replace("#", '');

			if (generatorReturnedObject.value?.length > 0) {
				const twoPosts = generatorReturnedObject.value;

				if ((currPopstateChanges > initialPopstateChanges) || ((curWindowPath !== prevWindowPath) && prevWindowPath.startsWith('/car-pictures'))) {
					return Promise.reject("view changed");
				}

				posts.push(...twoPosts);
			} else {
				return html`${getNoPostsTemplate(postsType !== 'unapproved', ctx, true)}`
			}
		} else {
			const generatorReturnedObject = await generatorsObject.asyncPostsGenerator.next();
			generatorsObject.asyncPostsGeneratorIsDone = generatorReturnedObject.done;
			const currPopstateChanges = Number(sessionStorage.getItem('popstateChanges') || 0);

			let curWindowPath = window.location.href.replace(window.location.origin, '');
			curWindowPath = window.location.hash ? curWindowPath : curWindowPath.replace("#", '');

			if (generatorReturnedObject.value?.length > 0) {
				const twoPosts = generatorReturnedObject.value;

				if ((currPopstateChanges > initialPopstateChanges) || ((curWindowPath !== prevWindowPath) && prevWindowPath.startsWith('/car-pictures'))) {
					return Promise.reject("view changed");
				}

				posts.push(...twoPosts);
			}
		}
	}
}