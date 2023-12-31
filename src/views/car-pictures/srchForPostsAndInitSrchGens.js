import { get2SearchedPostObjects, get2UnapprovedSearchedPostObjects, searchForPosts } from "../../api/posts.js";

export async function srchForPostIdsAndInitSrchGens(ctx, urlSrchText, arrOfPostObjectIds, generatorsObject) {
	const srchResultsArr = await searchForPosts(urlSrchText);
	const postObjIds = [...new Set(srchResultsArr.sort((a, b) => b.matchCoefficient - a.matchCoefficient).map(srchResObj => srchResObj.postId))];
	arrOfPostObjectIds.push(...postObjIds)

	if (ctx.hash == 'approval-mode') {
		generatorsObject.asyncUnapprovedSearchPostsGenerator = get2UnapprovedSearchedPostObjects(arrOfPostObjectIds);
		generatorsObject.asyncUnapprovedSearchPostsGeneratorIsDone = false;
	} else {
		generatorsObject.asyncSearchPostsGenerator = get2SearchedPostObjects(arrOfPostObjectIds);
		generatorsObject.asyncSearchPostsGeneratorIsDone = false;
	}
}