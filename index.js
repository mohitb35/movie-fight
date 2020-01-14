const fetchData = async (searchTerm) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '8957c2b8',
			s: searchTerm
		}
	});

	console.log("Response", response.data);
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

const onInput = (event) => {
	console.log(this);
	fetchData(event.target.value);
}

// input.addEventListener('input', onInput);
input.addEventListener('input', debounce(onInput, 500));