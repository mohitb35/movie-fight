const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValueAfterSelect }) => {

	root.innerHTML = `
		<label><b>Search for a movie</b></label>
		<input type="text" class="input">
		<div class="dropdown">
			<div class="dropdown-menu">
				<div class="dropdown-content results"></div>
			</div>
		</div>
	`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');


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
			
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(movie);
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValueAfterSelect(movie);
				onOptionSelect(movie);
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
}