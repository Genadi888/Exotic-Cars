let clickedNavBtn = false;

export function collapseButtonClickFunction(topShadowRoot, ev) {
	ev.stopPropagation();
	const menuContainer = topShadowRoot.querySelector('#drop-down-menu-container');
	const button = ev.currentTarget;
	
	if (!clickedNavBtn) {
		menuContainer.style.transform = 'translateY(100%)';
		clickedNavBtn = true;

		button.disabled = true;
	} else {
		menuContainer.style.transform = 'translateY(0px)';
		clickedNavBtn = false;

		button.disabled = true;
	}
	
	menuContainer.addEventListener('transitionend', () => {
		button.removeAttribute('disabled');
	})
}