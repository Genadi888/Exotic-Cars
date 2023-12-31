export function checkIfRenderShouldStop(arrOfPostObjectIds, generatorsObject, ctx) {
	if (arrOfPostObjectIds?.length > 0 && (generatorsObject.asyncSearchPostsGeneratorIsDone || generatorsObject.asyncUnapprovedSearchPostsGeneratorIsDone)) {
		//? If one of the generators is exhausted, don't bother rendering anything.
		return true;
	}

	if ((arrOfPostObjectIds === undefined || arrOfPostObjectIds === null) && ((generatorsObject.asyncPostsGeneratorIsDone && ctx.hash != 'approval-mode') || (generatorsObject.asyncUnapprovedPostsGeneratorIsDone && ctx.hash == 'approval-mode'))) {
		//? If one of the generators is exhausted, don't bother rendering anything.
		return true
	}

	return false;
}