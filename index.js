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
    const movies = await fetchData(event.target.value);

    if (movies.length === 0) {
        dropdown.classList.remove('is-active');
        return;
    }

    dropdown.classList.add('is-active');
    resultWrapper.innerHTML = '';

    for (let movie of movies) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');

        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.innerHTML = `
            <img src="${imgSrc}">
            ${movie.Title} (${movie.Year})
        `;

        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;

            onMovieSelect(movie);
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

async function onMovieSelect(movie) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '424db95',
            i: movie.imdbID
        }
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}

function movieTemplate(movieDetail) {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}
