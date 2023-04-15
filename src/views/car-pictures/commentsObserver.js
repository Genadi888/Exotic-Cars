const resizeObserver = new ResizeObserver(entries => {
	for (const entry of entries) {
		const commentTextElement = entry.target;

		//? Here we get the raw value of the variable (as string):
		const cssVarForMaxHeight = getComputedStyle(commentTextElement.closest('#comments'))
			.getPropertyValue('--commentTextMaxHeight')
			.trim();

		//? If the variable's value ends with "vh", it will be converted to pixels, otherwise, the value will not be changed.
		const maxHeight = Math.floor(cssVarForMaxHeight.endsWith('vh') ?
			document.documentElement.clientHeight * +cssVarForMaxHeight.slice(0, -2) / 100 :
			+cssVarForMaxHeight.slice(0, -2));

		//? since we are observing only a single element, so we access the first element in entries array
		const commentTextHeight = Math.floor(+entry.borderBoxSize[0].blockSize);
		const commentTextWrapper = commentTextElement.parentElement;

		if (commentTextWrapper.style.maxHeight.trim() !== cssVarForMaxHeight //? Here we check if the current max-height differs from our CSS variable for max-height (this can occur after resizing).
			&& commentTextWrapper.style.maxHeight.match(/\d/) //? Here we make sure that both values are valid (different from "unset" or something else).
			&& cssVarForMaxHeight.match(/\d/)) {

			// console.log(commentTextWrapper.style.maxHeight.trim(), cssVar);
			commentTextWrapper.style.maxHeight = cssVarForMaxHeight;
		}

		const labelToClickOn = commentTextWrapper.querySelector('label[for="overflow-control-btn"]');
		const inputCheckbox = commentTextWrapper.querySelector('#overflow-control-btn');

		if (commentTextHeight > commentTextWrapper.clientHeight) {
			labelToClickOn.style.display = 'block'; //? If the comment text is overflowing outside the wrapper, the "show-more" label will be shown.
		}
		else if (commentTextHeight <= maxHeight || maxHeight == 0) {
			//? If the comment text is less than our desired max-height, the label will be hidden as there is no need for it.
			//? The label will also be hidden if the max-height is removed (screen becomes too large).

			labelToClickOn.style.display = 'none';
			if (inputCheckbox.classList.contains('overflow-control-btn-pressed')) {
				labelToClickOn.click(); //? Here we simulate a click, if the label is hidden after it has been clicked (last text was "show less"). We do that to prevent unwanted behavior.
			}
		}
	}
});

export function startObservingComments(commentTextElements) {	
	for (const commentTextElement of commentTextElements) {
		resizeObserver.observe(commentTextElement, { box: 'border-box' });
	}
}