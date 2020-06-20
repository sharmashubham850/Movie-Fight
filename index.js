const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}">
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '424db95',
                s: searchTerm
            }
        });

        if (response.data.Error) return [];

        return response.data.Search;
    }
}

createAutocomplete({
    root: document.querySelector('#left-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
})

createAutocomplete({
    root: document.querySelector('#right-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
})

let leftMovieFetched;
let rightMovieFetched;

async function onMovieSelect(movie, summaryElement, side) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '424db95',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') leftMovieFetched = true;
    else rightMovieFetched = true;

    // Run comparision after both movie data received
    if (leftMovieFetched && rightMovieFetched) {
        runComparision();
    }

}

function runComparision() {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    for (let i = 0; i < leftSideStats.length; i++) {
        const leftStat = leftSideStats[i];
        const rightStat = rightSideStats[i];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        // console.log(leftSideValue, rightSideValue);

        if (leftSideValue > rightSideValue) {
            // Make right stat yellow
            rightStat.classList.replace('is-primary', 'is-warning');
        }
        else {
            // Make left stat yellow
            leftStat.classList.replace('is-primary', 'is-warning');
        }
    }
}

function movieTemplate(movieDetail) {
    // Parsing movie stats
    let awards = 0;
    for (let word of movieDetail.Awards.split(' ')) {
        const value = parseInt(word);

        if (isNaN(value)) continue;
        else awards += value;
    }
    const dollars = parseInt(movieDetail.BoxOffice.slice(1).replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

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

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}
