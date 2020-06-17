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

const input = document.querySelector('input');

async function onInput(event) {
    const inputValue = event.target.value;
    const movies = await fetchData(inputValue);

    const targetDiv = document.querySelector('#target');
    for (let movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = '';

        div.innerHTML += `<img src="${movie.Poster}">`;
        div.innerHTML += `<h1>${movie.Title} (${movie.Year})`;

        targetDiv.appendChild(div);
    }


}

input.addEventListener('input', debounce(onInput, delay = 500))
