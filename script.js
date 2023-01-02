const words = fetch("words.json")
	.then((words) => words.json())
	.catch((error) => console.log(error));
