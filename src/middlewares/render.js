import { render as litRender } from "../lib/lit-html.js";
import { getCollapseClickHandler } from "../util.js";
import { layoutTemplate } from "../views/layout.js";

export function addRender() {
	let nestedShadowRoot = null;
	return (ctx, next) => {
		litRender(layoutTemplate(ctx.topShadowRoot, ctx.onLogout, ctx.user?.sessionToken, getCollapseClickHandler(ctx.topShadowRoot)), ctx.topShadowRoot); //? layout initialization

		ctx.render = (templateResult) => {
			if (nestedShadowRoot == null) {
				nestedShadowRoot = ctx.topShadowRoot.querySelector('main').attachShadow({ mode: 'open' });
			}

			//! a new context object is created for every page load, so we always add the following property
			ctx.nestedShadowRoot = nestedShadowRoot;
			
			litRender(templateResult, nestedShadowRoot);
		}
		next();
	}
}