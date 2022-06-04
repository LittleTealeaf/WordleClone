const body = document.getElementById("body");

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

async function newWord() {
    const resp = await fetch('./words.json');
    const arr = await resp.json();
    return choose(arr);
}


newWord().then(item => body.innerHTML = item)
