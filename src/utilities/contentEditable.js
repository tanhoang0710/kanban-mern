// onKeyDown
export const saveContentAfterPressEnter = (e) => {
	if (e.key === 'Enter') {
		e.target.blur();
	}
};

// select all input value when selected
export const selectAllInlineText = (e) => {
	e.target.focus();
	e.target.select();
};
