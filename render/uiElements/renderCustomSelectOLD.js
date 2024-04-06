import {handleShowSelectMenu, handleOptionClick} from "./handlersCustomSelectOLD.js";

export function renderCustomSelectOLD(parentElement, label, options, defaultSelectionData, defaultSelectionText) {
    // Container
    const customSelectContainer = document.createElement('div');
    customSelectContainer.className = 'customSelectContainer';

    // Select element label
    const selectLabel = document.createElement('label');
    selectLabel.className = 'selectLabel';
    selectLabel.innerText = label;

    // Custom select element
    const customSelect = document.createElement('div');
    customSelect.className = 'customSelect';
    customSelect.id = 'customSelect';

    // Select button
    const selectButton = document.createElement('button');
    selectButton.className = 'customSelectButton';
    selectButton.id = 'customSelectButton';
    selectButton.dataset['selectedData'] = defaultSelectionData;
    selectButton.addEventListener('click', (e) => handleShowSelectMenu(e, options));

    // Selected option
    const selectedOption = document.createElement('span');
    selectedOption.className = 'selectedOption';
    selectedOption.id = 'selectedOption';
    selectedOption.innerText = defaultSelectionText;

    // Arrow
    const selectArrow = document.createElement('span');
    selectArrow.className = 'selectArrow material-symbols-outlined';
    selectArrow.innerText = 'expand_more';

    // Compose
    parentElement.appendChild(customSelectContainer);
    customSelectContainer.appendChild(selectLabel);
    customSelectContainer.appendChild(customSelect);
    customSelect.appendChild(selectButton);
    selectButton.appendChild(selectedOption);
    selectButton.appendChild(selectArrow);
}

// Render options dropdown
export function renderDropdown(options) {
    const customSelect = document.getElementById('customSelect');

    const selectButton = document.getElementById('customSelectButton');
    console.log(selectButton.getBoundingClientRect());
    const bottom = selectButton.getBoundingClientRect().bottom;
    const dropdownOffset = bottom + 10;

    // Select dropdown <ul>
    const selectDropdown = document.createElement('ul');
    selectDropdown.className = 'selectDropdown';
    selectDropdown.id = 'selectDropdown';
    selectDropdown.setAttribute('style', `top: ${dropdownOffset}px`);

    // Select dropdown option <li>
    options.forEach((option, i) => {
        const optionItem = document.createElement('li');
        optionItem.className = 'option';
        optionItem.dataset['selectedId'] = option['listID'];
        optionItem.dataset['selectedText'] = option.title;
        optionItem.innerText = option.title;
        optionItem.addEventListener('click', (e) => handleOptionClick(e))

        selectDropdown.appendChild(optionItem);
    })
    // Compose
    customSelect.appendChild(selectDropdown);
}
