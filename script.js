const table = document.getElementById('guesses');
const keyboard = document.getElementById('keyboard');
const KEYBOARD_LETTERS = [
    'QWERTYUIOP'.split(""),
    'ASDFGHJKL'.split(""),
    'ZXCVBNM'.split("")
]
const CHARS = "abcdefghijklmnopqrstuvwxyz".split("").map(str => str.charAt(0));

const DEFAULT = 0, WRONG = 1, PARTIAL = 2, CORRECT = 3;


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

        const values = calcGuess(guess);

        guess.forEach((char, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if(values[index] == WRONG) {
                cell.classList.add('wrong');
            } else if(values[index] == PARTIAL) {
                cell.classList.add('partial');
            } else if(values[index] == CORRECT) {
                cell.classList.add('correct');
            }

            const content = document.createElement("p");
            content.innerHTML = char;
            cell.appendChild(content);

            row.appendChild(cell);
        })

        table.appendChild(row);
    });
    currentRow = document.createElement("div");
    currentRow.id = "currentguess";
    currentRow.classList.add("row");
    table.appendChild(currentRow);
    renderCurrent();
    buildKeyboard();
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

function calcGuess(guess) {
    const w = WORD.join("").split("");
    const r = w.map(i => WRONG);

    guess.forEach((char,index) => {
        if(char == WORD[index]) {
            r[index] = CORRECT;
            removeItemOnce(w,char);
        }
    });
    guess.forEach((char,index) => {
        if(contains(w,char) && r[index] != CORRECT) {
            r[index] = PARTIAL;
            removeItemOnce(w,char);
        }
    })
    return r;

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

function buildKeyboard() {
    keyboard.innerHTML = "";
    KEYBOARD_LETTERS.forEach(rowcontent => {
        const row = document.createElement('div');
        row.classList.add('row');
        rowcontent.forEach(item => {

            var type = DEFAULT;

            previousGuesses.forEach(guess => {
                const a = calcGuess(guess);
                guess.forEach((char,index) => {
                    if(char.toLowerCase() == item.toLowerCase()) {
                        type = Math.max(type,a[index]);
                    }
                })
            });

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.onclick = () => keyPressed({key: String(item).toLowerCase()});

            if(type == PARTIAL) {
                cell.classList.add('partial');
            } else if(type == WRONG) {
                cell.classList.add('wrong');
            } else if(type == CORRECT) {
                cell.classList.add('correct');
            }


            const content = document.createElement('p');
            content.innerHTML = item;
            cell.appendChild(content);
            row.appendChild(cell);
        })
        keyboard.append(row);
    });
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
        if (arr[i] == item) {
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
buildKeyboard();
