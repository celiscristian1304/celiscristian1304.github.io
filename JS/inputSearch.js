/* Input Search section without drawing Gifs--------------------------------------------------------------------------------- */

(function () {
    if("magnifyingStatus" in localStorage){
        localStorage.setItem("magnifyingStatus", "normal");
    }else{
        localStorage.setItem("magnifyingStatus", "normal");
    };
})();


/* The following lines allow to change the position property of a specific tag */
window.addEventListener('scroll', function() {
    let scrollUp = window.pageYOffset;
    let sectionSearch = document.getElementById('searchInput');
    let buttonAddGifos = document.getElementsByClassName("addGifos")[0];
    if(scrollUp>400){
        sectionSearch.classList.replace("inputNormal", "inputFixed");
        buttonAddGifos.style.display = "none";
    }else if(scrollUp<=400){
        sectionSearch.classList.replace("inputFixed", "inputNormal");
        if(screen.width > 750){
            buttonAddGifos.style.display = "unset";
        }
    }
});
/* --------------------------------------------------------------------------- */

const urlSuggestions = "https://api.giphy.com/v1/gifs/search/tags";
const apiKeySearch = "2QPzgXptcn2TEysYoWRTcHiy3pBh9G6U";
const limitSuggestions = 4;
let offsetSecond = 0;

document.getElementById("textTosearch").addEventListener("input", event => {
    getWordSuggestions(event.target.value);
    drawMagnifyingActive(event.target.value);
    document.getElementById("magnifyingGlassNormal").classList.replace("none", "icon-search");
    document.getElementById("magnifyingGlassNormal").innerHTML = "";
    localStorage.setItem("magnifyingStatus", "normal");
    document.getElementById("magnifyingGlassActive").style.display = "none";
    document.getElementById("withoutResults").innerHTML = "";
    async function getWordSuggestions(characters){
        try{
            const fetchResults = await fetch(`${urlSuggestions}?api_key=${apiKeySearch}&q=${characters}&limit=${limitSuggestions}`);
            const jsonWordSuggestions = await fetchResults.json();
            let arrayWordsSuggested = [];
            for (let index = 0; index < jsonWordSuggestions.data.length; index++) {
                arrayWordsSuggested[index] = jsonWordSuggestions.data[index].name;
            };
            drawSuggestions(arrayWordsSuggested);
            addListenerWordSuggested(arrayWordsSuggested);
        } catch{
            console.error(error, "No se pudo acceder a la página de Giphy");
        };
    }
});

function drawSuggestions(fourWordsToSuggest){
    let divWordsSuggested = document.getElementById("suggestions");
    let htmlFourWordsSuggested = "";
    let htmlDivFourWordsSuggested = "";
    if(fourWordsToSuggest.length>0){
        for (let index = 0; index < fourWordsToSuggest.length; index++) {
            htmlFourWordsSuggested += `
                <div class="suggestionUnique">
                    <span class="icon-search"></span>
                    <span class="justOneWord" id="wordSuggested-${index}">${fourWordsToSuggest[index]}</span>
                </div>
            `;
        };
        htmlDivFourWordsSuggested = `
            <div id="wordSuggestions">
                ${htmlFourWordsSuggested}
            </div>
        `;
        divWordsSuggested.innerHTML = htmlDivFourWordsSuggested;
    }else if(fourWordsToSuggest.length===0){
        divWordsSuggested.innerHTML = "";
    }
}

function addListenerWordSuggested(jsonTrendingWordsSuggested){
    for (let index = 0; index < jsonTrendingWordsSuggested.length; index++) {
        document.getElementById(`wordSuggested-${index}`).addEventListener("click", event => {
            document.getElementById("textTosearch").value = jsonTrendingWordsSuggested[index];
            document.getElementById("suggestions").innerHTML = "";
            document.getElementById("magnifyingGlassNormal").classList.replace("icon-search", "none");
            localStorage.setItem("magnifyingStatus", "active");
            document.getElementById("magnifyingGlassNormal").innerHTML = "X";
            searchGifs(jsonTrendingWordsSuggested[index], 0, false);
            offsetSecond = 13;
        });
    }
}

function drawMagnifyingActive(word){
    let totalCharacters = word.length;
    let magnifyingActive = document.getElementById("magnifyingGlassActive");
    if(totalCharacters > 0){
        magnifyingActive.style.display = "unset";
    }else if(totalCharacters === 0){
        magnifyingActive.style.display = "none"
    }
}

document.getElementById("magnifyingGlassNormal").addEventListener("click", event => {
    let magnifyingGlassStatus = localStorage.getItem("magnifyingStatus");
    if(magnifyingGlassStatus === "normal"){
        event.target.classList.replace("icon-search", "none");
        event.target.innerHTML = "X";
        localStorage.setItem("magnifyingStatus", "active");
        document.getElementById("suggestions").innerHTML = "";
        searchGifs(document.getElementById("textTosearch").value, 0, false);
        offsetSecond = 13;
    }else if(magnifyingGlassStatus === "active"){
        event.target.classList.replace("none", "icon-search");
        event.target.innerHTML = "";
        localStorage.setItem("magnifyingStatus", "normal");
        document.getElementById("textTosearch").value = null;
        document.getElementById("magnifyingGlassActive").style.display = "none";
        document.getElementById("withoutResults").innerHTML = "";
        document.getElementById("titleResults").innerHTML = "";
        document.getElementById("gifsToShow").innerHTML = "";
        document.getElementById("buttonViewMore").innerHTML = "";
        document.getElementById("gifsToShow").style.marginBottom = "";
    };
});

/* -------------------------------------------------------------------------------------------------------------------- */

/* Top Five Words------------------------------------------------------------------------------------------------------ */

const urlTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches";
const totalWords = 5;

(async function() {
    try{
        const fetchResults = await fetch(`${urlTrendingSearchTerms}?api_key=${apiKeySearch}`);
        const jsonTrendingWords = await fetchResults.json();
        createTrendingWords(jsonTrendingWords);
        addListenerWordTrending(jsonTrendingWords);
    } catch (error) {
        console.error(error, "No se pudo acceder a la página de Giphy");
    }
})();

function createTrendingWords(jsonTrendingWords){
    let divFiveWords = document.getElementById("topFiveWords");
    let htmlFiveTrendingWords = "";
    for (let index = 0; index < totalWords; index++) {
        if(index < 4){
            htmlFiveTrendingWords += `
            <span id="wordTrending-${index}">${jsonTrendingWords.data[index]},</span>
            `
        }else{
            htmlFiveTrendingWords += `
            <span id="wordTrending-${index}">${jsonTrendingWords.data[index]}</span>
            `
        }
        
    }
    divFiveWords.innerHTML = htmlFiveTrendingWords;
};

function addListenerWordTrending(jsonTrendingWords){
    for (let index = 0; index < totalWords; index++) {
        document.getElementById(`wordTrending-${index}`).addEventListener("click", event => {
            document.getElementById("textTosearch").value = jsonTrendingWords.data[index];
            document.getElementById("magnifyingGlassActive").style.display = "unset";
            document.getElementById("magnifyingGlassNormal").classList.replace("icon-search", "none");
            localStorage.setItem("magnifyingStatus", "active");
            document.getElementById("magnifyingGlassNormal").innerHTML = "X";
            searchGifs(jsonTrendingWords.data[index], 0, false);
            offsetSecond = 13;
        });
    }
}
/* --------------------------------------------------------------------------------------------------------------------- */

/* Input Search section with drawing Gifs--------------------------------------------------------------------------------- */

document.getElementById("textTosearch").addEventListener("keypress", event => {
    if(event.key === "Enter"){
        document.getElementById("magnifyingGlassNormal").classList.replace("icon-search", "none");
        localStorage.setItem("magnifyingStatus", "active");
        document.getElementById("magnifyingGlassNormal").innerHTML = "X";
        document.getElementById("suggestions").innerHTML = "";
        searchGifs(event.target.value, 0, false);
        offsetSecond = 13;
    }
});

const urlSearchGifs = "https://api.giphy.com/v1/gifs/search";
const limitSearched = 12;

async function searchGifs(wordToSearch, offset, boolean){
    let viewPortWidthSearched = screen.width;
    try{
        const fetchResults = await fetch(`${urlSearchGifs}?api_key=${apiKeySearch}&q=${wordToSearch}&limit=${limitSearched}&offset=${offset}`);
        const jsonGifsSearched= await fetchResults.json();
        gifsToDraw(jsonGifsSearched, wordToSearch, boolean, offset);
        addListenerLikeButtonSearched(jsonGifsSearched);
        addListenerExpandButtonSearched(jsonGifsSearched, viewPortWidthSearched);
        addListenerCloseExpandButtonSearched(jsonGifsSearched); 
        addListenerDownloadButtonHoverSearched(jsonGifsSearched);
    } catch (error) {
        console.error(error, "No se pudo acceder a la página de Giphy");
    }
}

function gifsToDraw (jsonGifsSearched, wordSearched, boolean, offset){
    if(boolean){
        if(jsonGifsSearched.data.lenght === 0){
            document.getElementById("buttonViewMore").innerHTML = "";
            document.getElementById("gifsToShow").style.marginBottom = "78px";
        }else{
            createGifsSearched(jsonGifsSearched);
            if((offset+12) > jsonGifsSearched.pagination.total_count){
                document.getElementById("buttonViewMore").innerHTML = "";
                document.getElementById("gifsToShow").style.marginBottom = "78px";
            };
        }
    }else{
        if(jsonGifsSearched.data.length === 0){
            document.getElementById("withoutResults").innerHTML = `
                <h3 id="titleWithOutResults">${wordSearched}</h3>
                <img src="./images/icon-busqueda-sin-resultado.svg" alt="Búsqueda sin resultado" id="imageWithOutResults">
                <p id="legendWithOutResults">Intenta con otra búsqueda.</p>
            `;
            document.getElementById("titleResults").innerHTML = "";
            document.getElementById("gifsToShow").innerHTML = "";
            document.getElementById("buttonViewMore").innerHTML = "";
        }else{
            document.getElementById("titleResults").innerHTML = `<h3 id="titleWithResults">${wordSearched}</h3>`;
            createGifsSearched(jsonGifsSearched);
            document.getElementById("gifsToShow").style.marginBottom = "78px";
            if((offset+12) < jsonGifsSearched.pagination.total_count){
                document.getElementById("buttonViewMore").innerHTML = `<button id="viewMore">VER MÁS</button>`;
                document.getElementById("gifsToShow").style.marginBottom = "";
            };
        };
    }
    
}

function createGifsSearched(jsonGifsSearched){
    let divGifosToShow = document.getElementById("gifsToShow");
    let htmlGifosToShow = "";
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    let heartButton = "";
    for (let index = 0; index < jsonGifsSearched.data.length; index++) {
        /* Verify if a gif exist in favorite pages */
        let existGif = favorites.filter(element => element.id === jsonGifsSearched.data[index].id);
        if(existGif.length === 0){
            heartButton = `<span class="icon-heart-o"></span>`;
        }
        else{
            heartButton = `<span class="icon-heart"></span>`;
        }
        /* The following code line allow to extract the exact title's Gif */
        htmlGifosToShow += `
        <div id="cardSearch-${jsonGifsSearched.data[index].id}" class="cardNormal">
            <span class="buttonCloseExpandSearch" id="closeExpandSearch-${jsonGifsSearched.data[index].id}">X</span>
            <img id="imgSearch-${jsonGifsSearched.data[index].id}" src="${jsonGifsSearched.data[index].images.original.url}" alt="${jsonGifsSearched.data[index].title.substring(0, jsonGifsSearched.data[index].title.indexOf("GIF")-1)}">
            <div class="hoverColorSearch"></div>
            <div class="buttonsScriptSearch">
                <button class="likeScriptSearch" id="addTrendSearch-${jsonGifsSearched.data[index].id}">
                    ${heartButton}
                </button>
                <a class="downloadScriptSearch" id="downloadTrendSearch-${jsonGifsSearched.data[index].id}" download="${jsonGifsSearched.data[index].title.substring(0, jsonGifsSearched.data[index].title.indexOf("GIF")-1)}">
                    <span class="icon-download"></span>
                </a>
                <button class="expandScriptSearch" id="expandTrendSearch-${jsonGifsSearched.data[index].id}">
                    <span class="icon-expand"></span>
                </button>
            </div>
            <div class="infoGifSearch">
                <h4>${jsonGifsSearched.data[index].username}</h4>
                <h3>${jsonGifsSearched.data[index].title.substring(0, jsonGifsSearched.data[index].title.indexOf("GIF")-1)}</h3>
            </div>
        </div>
        `;
    }
    divGifosToShow.innerHTML = htmlGifosToShow;
};

document.getElementById("buttonViewMore").addEventListener("click", event => {
    searchGifs((document.getElementById("titleWithResults").innerHTML), offsetSecond, true);
    offsetSecond += limitSearched +1;
});

function newFavoriteGifSearched(gifSearchedNew, event){
    let newGif ={
        "id": gifSearchedNew.id, 
        "url": gifSearchedNew.images.original.url,
        "title": gifSearchedNew.title.substring(0, gifSearchedNew.title.indexOf("GIF")-1),
        "username": gifSearchedNew.username
    };
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    let existGif = favorites.filter(element => element.id === newGif.id);
    if(existGif.length === 0){
        event.target.classList.replace("icon-heart-o", "icon-heart");
        event.target.innerHTML = `<span class="icon-heart"></span>`;
        favorites.push(newGif);
    }else{
        let indexOfElemetArray = 0;
        event.target.classList.replace("icon-heart", "icon-heart-o");
        event.target.innerHTML = `<span class="icon-heart-o"></span>`;
        /* The following line code extract the index of the element array with specific id */
        indexOfElemetArray = favorites.map(function(e){return e.id;}).indexOf(newGif.id);
        /* Now, with the index, is possible to remove the element */
        favorites.splice(indexOfElemetArray,1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addListenerLikeButtonSearched(jsonGifsSearched){
    for (let index = 0; index < jsonGifsSearched.data.length; index++) {
        document.getElementById(`addTrendSearch-${jsonGifsSearched.data[index].id}`).addEventListener("click", event => newFavoriteGifSearched(jsonGifsSearched.data[index], event));
    }
}

function expandGifToViewPortSearched(gifSearchedNew, lenght){
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementById("mainInformation").style.display = "none";
    document.getElementById("searchInput").style.display = "none";
    document.getElementById("trendingGifosTitle").style.display = "none";
    document.getElementById("sameFooter").style.display = "none";
    document.getElementById("topThreeTrendingGifos").style.display = "none";
    document.getElementById("trendingWords").style.display = "none";
    document.getElementById("titleResults").style.display = "none";
    document.getElementById("buttonViewMore").style.display = "none";
    document.getElementsByClassName("bottomTrendinggifos")[0].style.display = "none";
    document.getElementById(`cardSearch-${gifSearchedNew.id}`).classList.replace("cardNormal", "cardExpandGridGif");
    for (let index = 0; index < (lenght-1); index++) {
        document.getElementsByClassName("cardNormal")[index].style.display = "none";
    }
}

function addListenerExpandButtonSearched(jsonGifsSearched, viewPortWidthSearched){
    if(viewPortWidthSearched>=750){
        for (let index = 0; index < jsonGifsSearched.data.length; index++) {
            document.getElementById(`expandTrendSearch-${jsonGifsSearched.data[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(jsonGifsSearched.data[index], jsonGifsSearched.data.length));
        }
    }else if(viewPortWidthSearched<750){
        for (let index = 0; index < jsonGifsSearched.data.length; index++) {
            document.getElementById(`imgSearch-${jsonGifsSearched.data[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(jsonGifsSearched.data[index], jsonGifsSearched.data.length));
        }
    };
}

function closeExpandGifSearched(gifSearchedNew, lenght){
    document.getElementsByTagName("header")[0].style = "";
    document.getElementById("mainInformation").style = "";
    document.getElementById("searchInput").style = "";
    document.getElementById("trendingGifosTitle").style = "";
    document.getElementById("sameFooter").style = "";
    document.getElementById("topThreeTrendingGifos").style.display = "";
    document.getElementById("trendingWords").style.display = "";
    document.getElementById("titleResults").style.display = "";
    document.getElementById("buttonViewMore").style.display = "";
    document.getElementsByClassName("bottomTrendinggifos")[0].style.display = "";
    document.getElementById(`cardSearch-${gifSearchedNew.id}`).classList.replace("cardExpandGridGif", "cardNormal");
    for (let index = 0; index < lenght; index++) {
        document.getElementsByClassName("cardNormal")[index].style.display = "";
    }
}

function addListenerCloseExpandButtonSearched(jsonGifsSearched){
    for (let index = 0; index < jsonGifsSearched.data.length; index++) {
        document.getElementById(`closeExpandSearch-${jsonGifsSearched.data[index].id}`).addEventListener("click", event => closeExpandGifSearched(jsonGifsSearched.data[index], jsonGifsSearched.data.length));
    }
}

function downloadGifSearched(jsonGifsSearched){
    getBlob();
    async function getBlob(){
        const gifFetch = await fetch(jsonGifsSearched.images.original.url);
        const file = await gifFetch.blob();
        const a = document.getElementById(`downloadTrendSearch-${jsonGifsSearched.id}`);
        const urlBlob = URL.createObjectURL(file);
        a.href = urlBlob
    };
}

function addListenerDownloadButtonHoverSearched(jsonGifsSearched){
    for (let index = 0; index < jsonGifsSearched.data.length; index++) {
        document.getElementById(`cardSearch-${jsonGifsSearched.data[index].id}`).addEventListener("mouseover", event => downloadGifSearched(jsonGifsSearched.data[index]));
    }
}

/* --------------------------------------------------------------------------------------------------------------------- */