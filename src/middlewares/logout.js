import { createPointer } from "../api/data.js";
import { logout } from "../api/users.js"

export function addLogout() {
	return (ctx, next) => {
		ctx.onLogout = onLogout.bind(null, ctx);
		next();
	}
}

function onLogout(ctx) {
	logout(createPointer('_User', ctx.user?.objectId));
	ctx.page.redirect('/');
}