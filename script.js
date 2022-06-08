const table = document.getElementById('guesses');
const CHARS = "abcdefghijklmnopqrstuvwxyz".split("").map(str => str.charAt(0));



var WORD = "words";

var guess = [];

function render() {
    table.innerHTML = "";



}

function keyPressed(k) {

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
    WORD = word;
    render();
})

newGame();
