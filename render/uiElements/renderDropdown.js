// -----------------------------------------------------------------------------
// Render custom dropdown element
// -----------------------------------------------------------------------------
export function renderDropdown(options, label, selectedID, selectedValue) {
    // Wrapper
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdownWrapper';
    dropdownWrapper.id = 'dropdownWrapper';

    // Label
    const dropdownLabel = document.createElement('label');
    dropdownLabel.className = 'inputLabel';
    dropdownLabel.innerText = label;

    // Button
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'dropdownButton';
    dropdownButton.id = 'dropdownButton';
    dropdownButton.dataset['selectedId'] = selectedID;
    dropdownButton.addEventListener('click', (e) => handleShowOptions(e, options));

    const selectedOption = document.createElement('span');
    selectedOption.className = 'selectedOption';
    selectedOption.id = 'selectedOption';
    selectedOption.innerText = selectedValue;

    // Arrow
    const dropdownArrow = document.createElement('span');
    dropdownArrow.className = 'dropdownArrow material-symbols-outlined';
    dropdownArrow.innerText = 'expand_more';

    // Compose
    dropdownWrapper.appendChild(dropdownLabel);
    dropdownWrapper.appendChild(dropdownButton);
    dropdownButton.appendChild(selectedOption);
    dropdownButton.appendChild(dropdownArrow);

    return dropdownWrapper;
}

// -----------------------------------------------------------------------------
// Render the dropdown options
// -----------------------------------------------------------------------------
function renderDropdownOptions(options) {
    const dropdownWrapper = document.getElementById('dropdownWrapper');
    const dropdownButton = document.getElementById('dropdownButton');

    // Dropdown options list
    const dropdownOptions = document.createElement('ul');
    dropdownOptions.className = 'dropdownOptions';
    dropdownOptions.id = 'dropdownOptions';

    const bottomDropdownButton = dropdownButton.getBoundingClientRect().bottom;
    const dropdownOptionsOffset = bottomDropdownButton + 10;
    dropdownOptions.setAttribute('style', `top: ${dropdownOptionsOffset}px`);

    options.forEach(opt => {
        const {listID, title} = opt;

        const option = document.createElement('li');
        option.className = 'option';
        option.dataset['selectedId'] = listID;
        option.dataset['selectedValue'] = title;
        option.innerText = title;
        option.addEventListener('click', (e) => handleOptionClick(e));

        dropdownOptions.appendChild(option);
    })
    dropdownWrapper.appendChild(dropdownOptions);
}

// -----------------------------------------------------------------------------
// EVENT: Clicking an option
// -----------------------------------------------------------------------------
function handleOptionClick(e) {
    // Data from the clicked dropdown option
    const selectedID = e.target.closest('li').dataset.selectedId;
    const selectedValue = e.target.closest('li').dataset.selectedValue;

    // Update the dropdown button <span> to reflect the selected option
    const selectedOption = document.getElementById('selectedOption');
    selectedOption.innerText = selectedValue;

    // Update the dropdown button data to reflect the selected id
    const dropdownButton = document.getElementById('dropdownButton');
    dropdownButton.dataset.selectedId = selectedID;

    // Close the dropdown menu and reset the button to non-active styles
    dropdownButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');
    const dropdownOptions = document.getElementById('dropdownOptions');
    dropdownOptions.remove();
}

// -----------------------------------------------------------------------------
// EVENT: Click to show/hide dropdown options
// -----------------------------------------------------------------------------
function handleShowOptions(e, options) {
    e.preventDefault();

    const dropdownOptions = document.getElementById('dropdownOptions');
    const dropdownButton = document.getElementById('dropdownButton');

    if (!dropdownOptions) {
        dropdownButton.setAttribute('style', 'border: 1px solid #635FC7');
        renderDropdownOptions(options);
    } else {
        dropdownButton.setAttribute('style', 'border: 1px solid rgba(130, 143, 163, 0.25)');
        dropdownOptions.remove();
    }
}