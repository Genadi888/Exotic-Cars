import { getUserData } from "../util.js";

export function createPointer(className, objectId) {
	return {
		__type: 'Pointer',
		className,
		objectId
	}
}

export function addEntryWithUserPointer(item, keyName) {
	const userData = getUserData();
	item[keyName] = createPointer('_User', userData.objectId);
}