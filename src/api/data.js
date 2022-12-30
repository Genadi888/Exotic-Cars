import { getUserData } from "../util.js";

export function createPointer(className, objectId) {
	return {
		__type: 'Pointer',
		className,
		objectId
	}
}

export function addOwner(item) {
	const userData = getUserData();
	item.owner = createPointer('_User', userData.id);
}

// export function linkPost(image, postObjectId) {
// 	image.post = createPointer('Posts', postObjectId);
// }