const fetchData = async (searchTerm) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			s: searchTerm
		}
	});

	// console.log("Response", response.data);
	return response.data.Search;
}

// fetchData();

const fetchMovie = async () => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			i: 'tt0268978'
		}
	});

	console.log("Response", response.data);
}

// fetchMovie();


const input = document.querySelector('input');

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
	console.log(this);
	let movies = await fetchData(event.target.value);

	i
	for(let movie of movies){
		const div = document.createElement('div');
		div.innerHTML = `
			<img src="${movie.Poster}"/>
			<h1>${movie.Title}</h1>
		`;
		document.querySelector('#target').appendChild(div);

	}
}

// input.addEventListener('input', onInput);
input.addEventListener('input', debounce(onInput, 500));