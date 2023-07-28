const output = document.querySelector("#output");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener('click', () => {
    if (searchBar.value.trim() !== '') { 
        fetchDictionaryData(searchBar.value);
    }
});

searchBar.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && searchBar.value.trim() !== '') { 
        fetchDictionaryData(searchBar.value);
    }
});

async function fetchDictionaryData(searchedWord) {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`);
        const data = await res.json();
        wordData = data;
        searchedWordData(wordData);
        const audioBtn = document.getElementById("audio");
        audioBtn.addEventListener('click', () => {
            const audioURL = wordData[0]?.phonetics[0]?.audio || wordData[0]?.phonetics[1]?.audio;
            if (audioURL) {
                const audio = new Audio(audioURL);
                audio.play();
            }
        });
        searchBar.value = '';
    } catch (err) {
        output.innerHTML = '<h1 style="margin: auto;">Sorry, no data. Please try another word!</h1>';
    }
}

function getDefinitionAndExample(meaning) {
    if (!meaning || !meaning.definitions || meaning.definitions.length === 0) {
        return { definition: 'No API Data', example: 'No API Data' };
    }
    return {
        definition: meaning.definitions[0].definition || 'No API Data',
        example: meaning.definitions[0].example || 'No API Data'
    };
}

function searchedWordData(word) {
    const meaningsHTML = word[0].meanings.map((meaning) => {
        const { definition, example } = getDefinitionAndExample(meaning);
        return `
            <div class="meanings-container">
                <div class="part-of-speech">
                    <p class="title">Part of speech:</p>
                    <p class="content">${meaning.partOfSpeech || 'No API Data'}</p>
                </div>
                <div class="definition">
                    <p class="title">Definition:</p>
                    <p class="content">${definition}</p>
                </div>
                <div class="example">
                    <p class="title">Example:</p>
                    <p class="content">${example}</p>
                </div>
            </div>
        `;
}).join('');

const phonetic = word[0].phonetic || (word[0].phonetics[1] ? word[0].phonetics[1].text : 'No API Data');

const sourceLink = `https://en.wiktionary.org/wiki/${word[0].word}`;

output.innerHTML = `
        <div class="output-head">
            <div class="output-head-main">
                <button id="audio"><i class="fa-solid fa-volume-high"></i></button>
                <h1 id="word">${word[0].word}</h1>
            </div>
            <p id="phonetic">${phonetic}</p>
        </div>
        <div class="output-body">
            ${meaningsHTML}
        </div>
        <div class="output-footer">
            <a id="source" href="${sourceLink}" target="_blank">Source: ${sourceLink}</a>
        </div>
    `;
}
