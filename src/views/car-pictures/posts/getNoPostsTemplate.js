import { html } from "/src/lib/lit-html.js"

export const getNoPostsTemplate = (shouldIncludeCreateLink, ctx, nothingWasFound) => {
	if (nothingWasFound) {
		return html`<h1 id="no-posts">Nothing was found!</h1>`
	} else {
		return ctx.user?.sessionToken ? 
		html`
			<h1 id="no-posts">There are no posts yet. ${shouldIncludeCreateLink ? html`<br><a @click=${() => ctx.page.redirect('/share-photos')} href="/share-photos">Create one!</a>` : null}</h1>
		` :
		html`
			<h1 id="no-posts">There are no posts yet.<br><a @click=${() => ctx.page.redirect('/login')} href="/login">Log in</a> and create one!</h1>
		`
	}
}