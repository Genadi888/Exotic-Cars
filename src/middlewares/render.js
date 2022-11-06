import { render as litRender } from "../lib/lit-html.js";
import { layoutTemplate } from "../views/layout.js";

export function addRender() {
	let nestedShadowRoot = null;
	return (ctx, next) => {
		ctx.render = (templateResult) => {
			litRender(layoutTemplate(null, ctx.topShadowRoot), ctx.topShadowRoot);

			if (nestedShadowRoot == null) {
				nestedShadowRoot = ctx.topShadowRoot.querySelector('main').attachShadow({ mode: 'open' });
			}
			
			litRender(templateResult, nestedShadowRoot);
		}
		next();
	}
}