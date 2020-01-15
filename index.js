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

	console.log("Response", response.data);
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
}