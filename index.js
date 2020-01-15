const fetchData = async (searchTerm) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			s: searchTerm
		}
	});

	if (response.data.Error){
		return [];
	}
	
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

const fetchMovie = async (imdbID) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			i: imdbID
		}
	});
	return response.data;
}


const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


// Simple search delay
/*let timeoutId;
const onInput = (event) => {
	if(timeoutId) {
		clearTimeout(timeoutId); 
	}
	timeoutId = setTimeout(() => {
		fetchData(event.target.value);
	}, 500)
}; */

const onInput = async (event) => {
	let movies = await fetchData(event.target.value);

	if(!movies.length) {
		return;
	}

	resultsWrapper.innerHTML = '';
	dropdown.classList.add('is-active');
	
	for(let movie of movies){
		const option = document.createElement('a'); 
		const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;

		option.classList.add('dropdown-item');
		option.innerHTML = `
			<img src="${imgSrc}"/>
			${movie.Title}
		`;
		option.addEventListener('click', () => {
			input.value = movie.Title;
			dropdown.classList.remove('is-active');
			onMovieSelect(movie);
		})
		resultsWrapper.appendChild(option);

	}
}

// input.addEventListener('input', onInput);
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
	if(!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
		resultsWrapper.innerHTML = '';
	}
});


const onMovieSelect = async (movie) => {
	let movieDetails = await fetchMovie(movie.imdbID);
	console.log(movieDetails);
	document.querySelector('#summary').innerHTML = movieTemplate(movieDetails);
}

const movieTemplate = (movieDetails) => {
	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src=${movieDetails.Poster} alt=${movieDetails.Title}>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetails.Title}</h1>
					<h4>${movieDetails.Genre}</h4>
					<p>${movieDetails.Plot}</p>
				</div>
			</div>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.Awards}</p>
			<p class="subtitle">Awards</p>
			<p class="title">${movieDetails.BoxOffice}</p>
			<p class="subtitle">BoxOffice</p>
			<p class="title">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
			<p class="title">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
			<p class="title">${movieDetails.imdbVotes}</p>
			<p class="subtitle">IMDB imdbVotes</p>
		</article>
	`
}