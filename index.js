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

/* const fetchMovie = async () => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			i: 'tt0268978'
		}
	});

	console.log("Response", response.data);
} */

// fetchMovie();


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