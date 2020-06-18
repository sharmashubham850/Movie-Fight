async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '424db95',
            s: searchTerm
        }
    });

    if (response.data.Error) return [];

    return response.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input type="text" class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultWrapper = document.querySelector('.results');

async function onInput(event) {
    const inputValue = event.target.value;
    const movies = await fetchData(inputValue);

    if (movies.length === 0) {
        dropdown.classList.remove('is-active');
        return;
    }

    dropdown.classList.add('is-active');
    resultWrapper.innerHTML = '';

    for (let movie of movies) {
        const item = document.createElement('a');
        item.classList.add('dropdown-item');

        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        item.innerHTML = `
            <img src="${imgSrc}">
            ${movie.Title} (${movie.Year})
        `;

        resultWrapper.appendChild(item);
    }


}

input.addEventListener('input', debounce(onInput, delay = 500))

// Dropdown close
document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});
