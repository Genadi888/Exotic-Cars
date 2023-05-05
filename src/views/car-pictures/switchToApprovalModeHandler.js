let btnClicked = false;

export function getSwitchToApprovalModeHandler(ctx) {
	return function onSwitchToApprovalMode(switchEv) {
		const button = switchEv.currentTarget;

		if (!btnClicked) {
			if (ctx.hash != 'approval-mode') {
				window.location = '#approval-mode';
			}
			button.textContent = 'Switch to normal mode';
			btnClicked = true;
		} else {
			window.location = '#';
			button.textContent = 'Switch to approval mode';
			btnClicked = false;
		}
	}
}