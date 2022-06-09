const table = document.getElementById('guesses');
const CHARS = "abcdefghijklmnopqrstuvwxyz".split("").map(str => str.charAt(0));



var WORD = [];

var previousGuesses = [
];

var currentGuess = [];
var currentRow;

function render() {
    table.innerHTML = "";

    previousGuesses.forEach(guess => {
        const row = document.createElement("div");
        row.classList.add('row');

        const w = WORD.join("").split("");

        guess.forEach((char, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if(WORD[index] == guess[index]) {
                cell.classList.add("correct");
                removeItemOnce(w,char);
            } else if(contains(w,char)) {
                cell.classList.add("partial");
                removeItemOnce(w,char);
            } else {
                cell.classList.add("wrong");
            }

            const content = document.createElement("p");
            content.innerHTML = char;
            cell.appendChild(content);

            row.appendChild(cell);
        })

        table.appendChild(row);
    });
    currentRow = document.createElement("div");
    currentRow.classList.add("row");
    table.appendChild(currentRow);
    renderCurrent();
}

function renderCurrent() {
    currentRow.innerHTML = "";
    currentGuess.forEach((char) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const content = document.createElement("p");
        content.innerHTML = char;
        cell.appendChild(content);

        currentRow.appendChild(cell);
    });
}


async function keyPressed(k) {

    if (CHARS.filter(a => a == k.key.toLowerCase()).length > 0) {
        if (currentGuess.length < 5) {
            currentGuess.push(k.key);
        }
    } else if (k.key == "Backspace") {
        if (currentGuess.length > 0) {
            currentGuess.pop();
        }
    } else if (k.key == "Enter") {
        if (currentGuess.length == 5) {
            const words = await fetchWords();
            for (var i in words) {
                if (currentGuess.join("") == words[i]) {
                    previousGuesses.push(currentGuess);
                    currentGuess = [];
                    render();
                    return;
                }
            }
        }
    }
    renderCurrent();
}


function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


function contains(arr, item) {
    for (var i in arr) {
        if (arr[i] = item) {
            return true;
        }
    }
    return false;
}

const fetchWords = async () => fetch('./words.json').then(response => response.json());

const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

const newGame = () => fetchWords().then(choose).then((word) => {
    WORD = word.split("");
    render();
})

document.onkeydown = keyPressed;

newGame();
