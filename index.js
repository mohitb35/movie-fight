const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
		return `
			<img src="${imgSrc}"/>
			${movie.Title} (<i>${movie.Year}</i>)
		`;
	},
	inputValueAfterSelect(movie) {
		return movie.Title
	}, 
	async fetchData(searchTerm) {
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
}

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'));
	},
 });

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'));
	},
 });


const fetchMovie = async (imdbID) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			i: imdbID
		}
	});
	return response.data;
}


const onMovieSelect = async (movie, summaryElement) => {
	let movieDetails = await fetchMovie(movie.imdbID);
	console.log(movieDetails);
	summaryElement.innerHTML = movieTemplate(movieDetails);
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
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.BoxOffice}</p>
			<p class="subtitle">BoxOffice</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.imdbVotes}</p>
			<p class="subtitle">IMDB imdbVotes</p>
		</article>
	`
}