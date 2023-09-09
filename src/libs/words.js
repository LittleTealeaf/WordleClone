export async function get_words() {
	let response = await fetch("words.json");
	let words = await response.json();
	return words;
}
