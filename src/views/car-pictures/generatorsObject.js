import { get2PostObjects, get2UnapprovedPostObjects } from "../../api/posts.js";

export const generatorsObject = {
	asyncPostsGenerator: get2PostObjects(),
	asyncPostsGeneratorIsDone: false,
	asyncUnapprovedPostsGenerator: get2UnapprovedPostObjects(),
	asyncUnapprovedPostsGeneratorIsDone: false,
	asyncSearchPostsGenerator: null,
	asyncSearchPostsGeneratorIsDone: false,
	asyncUnapprovedSearchPostsGenerator: null,
	asyncUnapprovedSearchPostsGeneratorIsDone: false,
	reset() {
		this.asyncPostsGenerator = get2PostObjects();
		this.asyncPostsGeneratorIsDone = false;
		this.asyncUnapprovedPostsGenerator = get2UnapprovedPostObjects();
		this.asyncUnapprovedPostsGeneratorIsDone = false;
		this.asyncSearchPostsGenerator = null;
		this.asyncSearchPostsGeneratorIsDone = false;
		this.asyncUnapprovedSearchPostsGenerator = null;
		this.asyncUnapprovedSearchPostsGeneratorIsDone = false;
	},
};