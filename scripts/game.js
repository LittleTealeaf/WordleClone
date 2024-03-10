/// <reference path="./cookies.js" />

const board = document.getElementById("board");
const winprompt = document.getElementById("winprompt");
const CHARS = "abcdefghijklmnopqrstuvwxyz"
	.split("")
	.map((str) => str.charAt(0));

const GAMES = [];

const KEYBOARD_LETTERS = [
	"QWERTYUIOP".split(""),
	"ASDFGHJKL".split(""),
	"ZXCVBNM".split(""),
];

let WORDS = [];

var ANSWER = [];

var has_stats = false;
winprompt.dataset.minimize = "";

function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

function addScore(number) {
	if (document.cookie.length == 0) {
		document.cookie = "scores=" + number;
	} else {
		document.cookie += "," + number;
	}
}

function updateDisplay() {
	try {
		const data = {};
		var max = 0;
		var maxHeight = 1;
		document.cookie
			.split("=")[1]
			.split(",")
			.map((i) => Number(i))
			.forEach((i) => {
				if (data[i] == null) {
					data[i] = 1;
				} else {
					data[i]++;
					if (maxHeight < data[i]) {
						maxHeight = data[i];
					}
				}
				if (i > max) {
					max = i;
				}
			});

		const stats = document.getElementById("graph");
		stats.innerHTML = "";

		for (var i = 1; i <= max; i++) {
			has_stats = true;
			if (data[i] == null) {
				data[i] = 0.1;
			}
			const countLabel = document.createElement("div");
			countLabel.innerHTML = data[i];

			const bar = document.createElement("div");
			bar.classList.add("bar");

			const percentage = data[i] / maxHeight;
			bar.style.height = `${percentage * 100}%`;

			const barcontainer = document.createElement("div");
			barcontainer.classList.add("barcontainer");
			barcontainer.appendChild(bar);

			const label = document.createElement("div");
			label.classList.add("label");
			label.innerHTML = i;

			const column = document.createElement("div");
			column.classList.add("column");

			column.appendChild(barcontainer);
			column.appendChild(label);

			stats.appendChild(column);
		}
	} catch (e) { }
}

class Keyboard {
	constructor() {
		this.element = document.getElementById("keyboard");
		this.element.innerHTML = "";
		this.keys = {};
		KEYBOARD_LETTERS.forEach((row_letters) => {
			const row = document.createElement("div");
			row.classList.add("row");

			row_letters.forEach((letter) => {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.classList.add("noselect");
				cell.onclick = (_) => {
					keyPressed({
						key: letter,
					});
				};
				cell.dataset.state = "unknown";
				cell.innerHTML = letter;
				row.appendChild(cell);
				this.keys[letter] = cell;
			});

			this.element.appendChild(row);
		});
	}

	setColor(key, value) {
		if (this.keys[key].dataset.state == "unknown") {
			this.keys[key].dataset.state = value;
		} else if (
			this.keys[key].dataset.state == "partial" &&
			value == "correct"
		) {
			this.keys[key].dataset.state = value;
		}
	}

	hide() {
		this.element.dataset.hide = "";
	}

	show() {
		delete this.element.dataset.hide;
	}
}

class Guess {
	constructor() {
		this.element = document.createElement("div");
		this.element.classList.add("row");
		this.index = 0;
		this.letters = [];
		for (var i = 0; i < 5; i++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.pop = "c";
			this.element.appendChild(cell);
		}
		board.appendChild(this.element);

		this.setActive(true);
		setTimeout(
			() =>
				this.element.childNodes.forEach((node) => {
					node.dataset.pop = "f";
				}),
			1,
		);
		this.element.scrollIntoView({ behavior: "smooth" });
	}

	add(value) {
		if (this.index < 5) {
			this.element.children[this.index].innerHTML = value;
			this.element.children[this.index].dataset.pop = "t";
			this.letters.push(value);
			this.index++;
		}
	}

	remove() {
		if (this.index > 0) {
			this.index--;
			this.element.children[this.index].innerHTML = "";
			this.element.children[this.index].dataset.pop = "f";
			this.letters.pop();
		}
	}

	setActive(isActive) {
		this.element.dataset.active = isActive;
		this.element.childNodes.forEach((child) => delete child.dataset.pop);
	}

	flashRed() {
		this.element.dataset.invalid = "";
		setTimeout(() => delete this.element.dataset.invalid, 100);
	}

	color(correct) {
		const pool = [...correct];
		const nodes = this.element.childNodes;
		// put green values
		nodes.forEach((node, i) => {
			if (correct[i] == node.innerHTML) {
				node.dataset.state = "correct";
				removeItemOnce(pool, correct[i]);
				keyboard.setColor(correct[i], "correct");
			}
		});

		if (pool.length == 0) {
			return false;
		}

		nodes.forEach((node) => {
			if (node.dataset.state == null) {
				if (pool.includes(node.innerHTML)) {
					removeItemOnce(pool, node.innerHTML);
					node.dataset.state = "partial";
					keyboard.setColor(node.innerHTML, "partial");
				} else {
					node.dataset.state = "wrong";
					keyboard.setColor(node.innerHTML, "wrong");
				}
			}
		});
		return true;
	}
}

var keyboard;

var guesses;

var activeGuess;

async function keyPressed(k) {
	if (activeGuess != null) {
		if (CHARS.filter((a) => a == k.key.toLowerCase()).length > 0) {
			activeGuess.add(k.key.toUpperCase());
		} else if (k.key == "Backspace") {
			activeGuess.remove();
		} else if (k.key == "Enter") {
			if (activeGuess.letters.length == 5) {
				if (isValidWord(activeGuess.letters.join(""))) {
					activeGuess.setActive(false);
					if (activeGuess.color(ANSWER)) {
						guesses.push((activeGuess = new Guess()));
					} else {
						//Game Win
						addScore(guesses.length);
						updateDisplay();
						GAMES.push({
							word: ANSWER,
							count: guesses.length,
						});
						activeGuess = null;
						keyboard.hide();
						if (has_stats) {
							delete winprompt.dataset.minimize;
						}
					}
				} else {
					activeGuess.flashRed();
				}
			}
		}
		// activeGuess.length ==
		if (activeGuess.letters.length == 0 && WORDS.length == 0) {
			if (has_stats) {
				delete winprompt.dataset.minimize;
			}
		} else {
			winprompt.dataset.minimize = "";
		}
	} else {
		if (k.key == " ") {
			newGame();
		}
	}
}

function isValidWord(word) {
	return WORDS.includes(word.toUpperCase());
}

const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

document.onkeydown = keyPressed;

fetch("./words.json")
	.then((response) => response.json())
	.then((words) => words.map((word) => word.toUpperCase()))
	.then((words) => {
		WORDS = words;
		newGame();
	});

function newGame() {
	ANSWER = choose(WORDS);
	board.innerHTML = "";
	guesses = [(activeGuess = new Guess())];
	keyboard = new Keyboard();
	keyboard.show();
	updateDisplay();
}

updateDisplay();

if (has_stats) {
	delete winprompt.dataset.minimize;
}

document.getElementById("playagain").onclick = newGame;
