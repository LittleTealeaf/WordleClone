const board = document.getElementById("board");
const CHARS = "abcdefghijklmnopqrstuvwxyz".split("").map(str => str.charAt(0));

const KEYBOARD_LETTERS = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    "ZXCVBNM".split("")
];





let WORDS = [];

var ANSWER = [];

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

class Keyboard {
    constructor() {
        this.element = document.getElementById("keyboard");
        this.element.innerHTML = "";
        this.keys = {};
        KEYBOARD_LETTERS.forEach((row_letters) => {
            const row = document.createElement("div");
            row.classList.add("row");

            row_letters.forEach(letter => {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.state = 'unknown';
                cell.innerHTML = letter;
                row.appendChild(cell);
                this.keys[letter] = cell;
            });

            this.element.appendChild(row);
        });
    }

    setColor(key,value) {
        if(this.keys[key].dataset.state == 'unknown') {
            this.keys[key].dataset.state = value;
        } else if(this.keys[key].dataset.state == 'partial' && value == 'correct') {
            this.keys[key].dataset.state = value;
        }
    }
}

class Guess {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("row");
        this.index = 0;
        this.letters = []
        for (var i = 0; i < 5; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.pop = "c";
            this.element.appendChild(cell);
        }
        board.appendChild(this.element);

        this.setActive(true);
        setTimeout(() => this.element.childNodes.forEach(node => {
            node.dataset.pop = 'f';
        }), 1);
        this.element.scrollIntoView({ behavior: "smooth"});
    }

    add(value) {
        if (this.index < 5) {
            this.element.children[this.index].innerHTML = value;
            this.element.children[this.index].dataset.pop = 't';
            this.letters.push(value);
            this.index++;
        }

    }

    remove() {
        if (this.index > 0) {
            this.index--;
            this.element.children[this.index].innerHTML = null;
            this.element.children[this.index].dataset.pop = 'f';
            this.letters.pop();
        }
    }

    setActive(isActive) {
        this.element.dataset.active = isActive;
        this.element.childNodes.forEach(child => delete child.dataset.pop);
    }

    flashRed() {
        this.element.dataset.invalid = '';
        setTimeout(() => delete this.element.dataset.invalid, 100);
    }

    color(correct) {
        const pool = [...correct];
        const nodes = this.element.childNodes;
        // put green values
        nodes.forEach((node,i) => {
            if(correct[i] == node.innerHTML) {
                node.dataset.state = 'correct';
                removeItemOnce(pool,correct[i]);
                keyboard.setColor(correct[i],'correct');
            }
        });

        if(pool.length == 0) {
            return false;
        }

        nodes.forEach((node) => {
            if(node.dataset.state == null) {
                if(pool.includes(node.innerHTML)) {
                    removeItemOnce(pool,node.innerHTML);
                    node.dataset.state = 'partial';
                    keyboard.setColor(node.innerHTML,'partial');
                } else {
                    node.dataset.state = 'wrong';
                    keyboard.setColor(node.innerHTML,'wrong');
                }
            }
        });
        return true;
    }


}

const keyboard = new Keyboard();

var guesses = [
    new Guess()
]


async function keyPressed(k) {
    if (CHARS.filter(a => a == k.key.toLowerCase()).length > 0) {
        guesses[guesses.length - 1].add(k.key.toUpperCase());
    } else if (k.key == "Backspace") {
        guesses[guesses.length - 1].remove();
    } else if (k.key == "Enter") {
        if (guesses[guesses.length - 1].letters.length == 5) {
            if (isValidWord(guesses[guesses.length - 1].letters.join(''))) {
                guesses[guesses.length - 1].setActive(false);
                if(guesses[guesses.length - 1].color(ANSWER)) {
                    guesses.push(new Guess());
                }

            } else {
                guesses[guesses.length - 1].flashRed();
            }
        }
    }
}

function isValidWord(word) {
    return WORDS.includes(word.toUpperCase());
}

const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

document.onkeydown = keyPressed;


fetch('./words.json').then(response => response.json()).then(words => words.map(word => word.toUpperCase())).then(words => {
    WORDS = words;
    ANSWER = choose(words).split("");
});
