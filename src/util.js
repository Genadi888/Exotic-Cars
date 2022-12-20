let clickedNavBtn = false;
const transitionDelay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '1s';

export function collapseButtonClickFunction(topShadowRoot, ev) {
	ev.stopPropagation();
	const menuContainer = topShadowRoot.querySelector('#drop-down-menu-container');
	const button = ev.currentTarget;
	menuContainer.style.transition = `transform ${transitionDelay} ease-in-out`;
	
	if (!clickedNavBtn) {
		menuContainer.style.transform = 'translateY(0%)';
		clickedNavBtn = true;
		button.disabled = true;
	} else {
		menuContainer.style.transform = 'translateY(-100%)';
		clickedNavBtn = false;
		button.disabled = true;
	}
	
	menuContainer.addEventListener('transitionend', () => {
		button.removeAttribute('disabled');
	})
}