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
				ctx.user,
				collapseClickHandler,
				navProfileToolsObj,
			),
			ctx.topShadowRoot
		);

		function collapseClickHandler(ev) {
			const transitionDelay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '500ms';
			
			const menuContainer = ctx.topShadowRoot.querySelector('#drop-down-menu-container');
			const menuContainerStyle = getComputedStyle(menuContainer);

			const collapseButton = ctx.topShadowRoot.querySelector('#collapse-button');
			menuContainer.style.transition = `transform ${transitionDelay} ease-in-out`;
			
			if (menuContainerStyle.transform !== 'matrix(1, 0, 0, 1, 0, 0)' 
			&& ev.currentTarget.tagName !== 'A') { //? the menu can't be opened by clicking on a link
				menuContainer.style.transform = 'translateY(0%)';
				collapseButton.disabled = true;
			} else if (menuContainerStyle.transform == 'matrix(1, 0, 0, 1, 0, 0)') {
				menuContainer.style.transform = 'translateY(-100%)';
				collapseButton.disabled = true;
			}

			menuContainer.addEventListener('transitionend', ev => {
				if (ev.propertyName === 'transform') {
					collapseButton.removeAttribute('disabled');
				}
			});
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