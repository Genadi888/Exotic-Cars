import { render as litRender } from "../../lib/lit-html.js";
import { layoutTemplate } from "../../views/layout.js";
import * as navProfileToolsObj from "./navProfileTools.js";

export function addRender() {
	let nestedShadowRoot = null;

	return (ctx, next) => {
		//? layout initialization
		litRender(
			layoutTemplate(
				ctx.topShadowRoot,
				ctx.onLogout,
				ctx.user?.sessionToken,
				getCollapseClickHandler(),
				navProfileToolsObj,
			),
			ctx.topShadowRoot
		);

		function getCollapseClickHandler() {
			let clickedNavBtn = false;
			const transitionDelay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '1s';

			return (ev) => {
				const menuContainer = ctx.topShadowRoot.querySelector('#drop-down-menu-container');
				const button = ctx.topShadowRoot.querySelector('#collapse-button');
				menuContainer.style.transition = `transform ${transitionDelay} ease-in-out`;

				if (!clickedNavBtn && ev.currentTarget.tagName !== 'A') {
					menuContainer.style.transform = 'translateY(0%)';
					clickedNavBtn = true;
					button.disabled = true;
				} else {
					menuContainer.style.transform = 'translateY(-100%)';
					clickedNavBtn = false;

					if (ev.currentTarget.tagName !== 'A') {
						button.disabled = true;
					}
				}

				menuContainer.addEventListener('transitionend', ev => {
					if (ev.propertyName != 'transform') {
						return;
					}
					button.removeAttribute('disabled');
				})
			}
		}

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