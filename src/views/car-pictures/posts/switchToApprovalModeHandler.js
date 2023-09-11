export function getSwitchToApprovalModeHandler(ctx) {
	return function onSwitchToApprovalMode() {
		if (ctx.hash == 'approval-mode') {
			window.location = '#';
		} else {
			window.location = '#approval-mode';
		}
	}
}