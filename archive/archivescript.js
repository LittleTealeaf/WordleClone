const guessesElement = document.getElementById('guesses');

const chars = "abcdefghijklmnopqrstuvwxyz".split("").map(str => str.charAt(0));

const guesses = [];

var currentRow;
var currentGuess = [];

var word = "words";

function render() {
    guessesElement.innerHTML = "";
    guesses.forEach(item => {
        const row = document.createElement("tr");
        row.className = "row";


        var w = word.split("");

        const values = item.split("").map(value => {
            const td = document.createElement("td");
            td.innerHTML = value;
            td.classList.add("character");
            row.appendChild(td);
            return td;
        });

        values.forEach((item, index) => {
            if (word.charAt(index) == item.innerHTML.charAt(0)) {
                item.classList.add("correct");
                removeItemOnce(w,item.innerHTML);
            }
        });

        values.forEach((item,index) => {

            if(!item.classList.contains("correct")) {
                for(var i in w) {
                    if(w[i] == item.innerHTML) {
                        item.classList.add("partial");
                        removeItemOnce(w,item.innerHTML);
                        return;
                    }
                }
                item.classList.add("wrong");
            }
        });


        console.log(values);
        guessesElement.appendChild(row);
    })

    currentRow = document.createElement("tr");
    currentRow.className = "row";
    guessesElement.appendChild(currentRow);
    renderCurrent();
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


function renderCurrent() {
    currentRow.innerHTML = "";
    currentGuess.forEach((char, index) => {
        const c = document.createElement("td");
        c.innerHTML = char;
        c.className = "character default"
        currentRow.appendChild(c);
    })

}

async function keyPressed(ev) {
    if (isAlpha(ev.key.toLowerCase())) {
        if (currentGuess.length < 5) {
            currentGuess = currentGuess + ev.key;
        }
    } else if (ev.key == "Backspace") {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
        }
    } else if (ev.key == "Enter" && currentGuess.length == 5) {

        const words = await fetchWords();
        for (var i in words) {
            if (currentGuess == words[i]) {
                guesses.push(currentGuess);
                currentGuess = "";
                render();
            }
        }
    }
    renderCurrent();
}


document.onkeydown = keyPressed;

function contains(array, item) {
    for (var i in array) {
        if (array[i] == item) {
            return true;
        }
    }
    return false;
}

function isAlpha(val) {
    for (var i in chars) {

        if (val == chars[i]) {
            return true;
        }
    }
    return false;
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

const fetchWords = async () => fetch('./words.json').then(response => response.json());

async function newWord() {
    return fetchWords().then(choose);
}

newWord().then(val => {
    word = val;
    render();
});
