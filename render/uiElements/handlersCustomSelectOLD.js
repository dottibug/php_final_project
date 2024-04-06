import {renderDropdown} from "./renderCustomSelectOLD.js";

// EVENT: Show/hide custom select dropdown menu
export function handleShowSelectMenu(e, options) {
    e.preventDefault();
    const selectDropdown = document.getElementById('selectDropdown');
    const customSelectButton = document.getElementById('customSelectButton');

    if (!selectDropdown) {
        customSelectButton.setAttribute('style', 'border: 1px solid #635FC7');
        renderDropdown(options);
    } else {
        customSelectButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');
        selectDropdown.remove();
    }
}

// EVENT: Option click
export function handleOptionClick(e) {
    // Get clicked option
    const selectedId = e.target.closest('li').dataset.selectedId;
    const selectedText = e.target.closest('li').dataset.selectedText;
    // const selectedData = e.target.closest('li').dataset.selectedData;

    // Set selected option
    const selectedOption = document.getElementById('selectedOption');
    selectedOption.innerText = selectedText;

    // Update data attribute on custom select button
    const customSelectButton = document.getElementById('customSelectButton');
    // Update custom select with selected options
    customSelectButton.dataset['selectedData'] = selectedId;
    // Close dropdown and reset to non-active styles
    customSelectButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');

    // Remove dropdown from UI
    const selectDropdown = document.getElementById('selectDropdown');
    selectDropdown.remove();
}