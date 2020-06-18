function createAutocomplete({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) {
    root.innerHTML = `
    <label><b>Search</b></label>
    <input type="text" class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultWrapper = root.querySelector('.results');

    async function onInput(event) {
        const items = await fetchData(event.target.value);

        if (items.length === 0) {
            dropdown.classList.remove('is-active');
            return;
        }

        dropdown.classList.add('is-active');
        resultWrapper.innerHTML = '';

        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item)

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            });

            resultWrapper.appendChild(option);
        }


    }

    input.addEventListener('input', debounce(onInput, delay = 500))

    // Dropdown close
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
}
