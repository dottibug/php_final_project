import {removeElement, findElement, createElement} from "./elements.js";

// Render dropdown component
// -----------------------------------------------------------------------------
export function renderDropdown(options, label, selectedID, selectedValue) {
    // Wrapper
    const dropdownWrapper = createElement('div', 'dropdownWrapper', 'dropdownWrapper');

    // Label
    const dropdownLabel = createElement('div', 'inputLabel', '', label);

    // Button
    const dropdownButton = createElement('button', 'dropdownButton', 'dropdownButton');
    dropdownButton.dataset['selectedId'] = selectedID;
    dropdownButton.addEventListener('click', (e) => handleShowOptions(e, options));
    const selectedOption = createElement('span', 'selectedOption', 'selectedOption', selectedValue);

    // Arrow
    const dropdownArrow = createElement('span', 'dropdownArrow material-symbols-outlined', '', 'expand_more');

    // Compose
    dropdownWrapper.appendChild(dropdownLabel);
    dropdownWrapper.appendChild(dropdownButton);
    dropdownButton.appendChild(selectedOption);
    dropdownButton.appendChild(dropdownArrow);

    return dropdownWrapper;
}

// Render the dropdown options
// -----------------------------------------------------------------------------
function renderDropdownOptions(options) {
    const dropdownWrapper = findElement('dropdownWrapper');
    const dropdownButton = findElement('dropdownButton');

    // Dropdown options list
    const dropdownOptions = createElement('ul', 'dropdownOptions', 'dropdownOptions');
    const bottomDropdownButton = dropdownButton.getBoundingClientRect().bottom;
    const dropdownOptionsOffset = bottomDropdownButton + 10;
    dropdownOptions.setAttribute('style', `top: ${dropdownOptionsOffset}px`);

    options.forEach(opt => {
        const {listID, title} = opt;
        const option = createElement('li', 'option', '', title);
        option.dataset['selectedId'] = listID;
        option.dataset['selectedValue'] = title;
        option.addEventListener('click', (e) => handleOptionClick(e));
        dropdownOptions.appendChild(option);
    })
    dropdownWrapper.appendChild(dropdownOptions);
}

// Selecting a dropdown option
// -----------------------------------------------------------------------------
function handleOptionClick(e) {
    // Data from the clicked dropdown option
    const selectedID = e.target.closest('li').dataset.selectedId;
    const selectedValue = e.target.closest('li').dataset.selectedValue;

    // Update the dropdown button <span> to reflect the selected option
    const selectedOption = findElement('selectedOption');
    selectedOption.innerText = selectedValue;

    // Update the dropdown button data to reflect the selected id
    const dropdownButton = findElement('dropdownButton');
    dropdownButton.dataset.selectedId = selectedID;

    // Close the dropdown menu and reset the button to non-active styles
    dropdownButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');
    removeElement('dropdownOptions');
}

// Show/hide dropdown options
// -----------------------------------------------------------------------------
function handleShowOptions(e, options) {
    e.preventDefault();

    const dropdownOptions = findElement('dropdownOptions');
    const dropdownButton = findElement('dropdownButton');

    if (!dropdownOptions) {
        dropdownButton.setAttribute('style', 'border: 1px solid #635FC7');
        renderDropdownOptions(options);
    } else {
        dropdownButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');
        dropdownOptions.remove();
    }
}