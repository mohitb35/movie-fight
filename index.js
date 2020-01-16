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
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
 });

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
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

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
	let movieDetails = await fetchMovie(movie.imdbID);
	console.log(movieDetails);
	summaryElement.innerHTML = movieTemplate(movieDetails);
	
	if(side === 'left') {
		leftMovie = movieDetails;
	} else {
		rightMovie = movieDetails;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
}

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = isNaN(leftStat.dataset.value) ? 0 : parseFloat(leftStat.dataset.value);
		const rightSideValue = isNaN(rightStat.dataset.value) ? 0 : parseFloat(rightStat.dataset.value);

		leftStat.classList.remove('is-info', 'is-warning', 'is-primary');
		rightStat.classList.remove('is-info', 'is-warning', 'is-primary');

		console.log(`Comparing ${leftSideValue} and ${rightSideValue}`);
		
		if(rightSideValue > leftSideValue){
			leftStat.classList.add('is-warning');
			rightStat.classList.add('is-primary');
		} else if (rightSideValue < leftSideValue){
			rightStat.classList.add('is-warning');
			leftStat.classList.add('is-primary');
		} else {
			leftStat.classList.add('is-info');
			rightStat.classList.add('is-info');
		}
	})
}

const movieTemplate = (movieDetails) => {

	// Extract values for each statistic. 
	// awardCount --> sum of awards + nominations, (dollars, imdbVotes) --> removed commas to allow parsing to take place properly
	let awardCount = movieDetails.Awards.split(' ').reduce((count, currentValue) => {
		let value = parseInt(currentValue);
		if(!isNaN(value)){
			return count + value; 
		} else {
			return count;
		}
	}, 0);

	let dollars = movieDetails.BoxOffice.replace(/[\$,]/g, '');
	let imdbVotes = movieDetails.imdbVotes.replace(/,/g, '');
	let imdbRating = movieDetails.imdbRating;
	let metascore = movieDetails.Metascore;


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
		<article data-value = ${awardCount} class="notification is-info">
			<p class="title">${movieDetails.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value = ${dollars} class="notification is-info">
			<p class="title">${movieDetails.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value = ${metascore} class="notification is-info">
			<p class="title">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value = ${imdbRating} class="notification is-info">
			<p class="title">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value = ${imdbVotes} class="notification is-info">
			<p class="title">${movieDetails.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`
}