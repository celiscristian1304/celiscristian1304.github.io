let startArray = 0;
let endArray = 11;
let favorites = JSON.parse(localStorage.getItem("favorites"));
(function searchGifs(){
    if(favorites.length === 0){
        drawWithOutFavorites();
    }else{
      if(favorites.length <= 12){
        createGifsSearched(favorites, startArray, (favorites.length-1));
        document.getElementById("withResults").style.marginBottom = "50px"
      }else{
        createGifsSearched(favorites, startArray, endArray);
        document.getElementById("buttonViewMore").innerHTML = `<button id="viewMore">VER MÁS</button>`;
      }
    };
})();

function drawWithOutFavorites(){
    document.getElementById("withoutResults").innerHTML = `
        <img src="../images/icon-fav-sin-contenido.svg" alt="Favoritos sin contenido">
        <p>"¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!"</p>
    `;
}

function createGifsSearched(favorites, startArray, endArray){
    let divGifosToShow = document.getElementById("gifsToShow");
    let htmlGifosToShow = "";
    /* let heartButton = ""; */
    for (let index = startArray; index < (endArray+1); index++) {
        /* Verify if a gif exist in favorite pages */
        /* let existGif = favorites.filter(element => element.id === jsonGifsSearched.data[index].id);
        if(existGif.length === 0){
            heartButton = `<span class="icon-heart-o"></span>`;
        }
        else{
            heartButton = `<span class="icon-heart"></span>`;
        } */
        /* The following code line allow to extract the exact title's Gif */
        htmlGifosToShow += `
        <div id="cardSearch-${favorites[index].id}" class="cardNormal">
            <span class="buttonCloseExpandSearch" id="closeExpandSearch-${favorites[index].id}">X</span>
            <img id="imgSearch-${favorites[index].id}" src="${favorites[index].url}" alt="${favorites[index].title}">
            <div class="hoverColorSearch"></div>
            <div class="buttonsScriptSearch">
                <button class="likeScriptSearch" id="addTrendSearch-${favorites[index].id}">
                    <span class="icon-heart"></span>
                </button>
                <a class="downloadScriptSearch" id="downloadTrendSearch-${favorites[index].id}" download="${favorites[index].title}">
                    <span class="icon-download"></span>
                </a>
                <button class="expandScriptSearch" id="expandTrendSearch-${favorites[index].id}">
                    <span class="icon-expand"></span>
                </button>
            </div>
            <div class="infoGifSearch">
                <h4>${favorites[index].username}</h4>
                <h3>${favorites[index].title}</h3>
            </div>
        </div>
        `;
    }
    divGifosToShow.innerHTML = htmlGifosToShow;
    addListenerLikeButtonSearched(favorites, startArray, endArray);
    addListenerExpandButtonSearched(favorites, startArray, endArray);
    addListenerCloseExpandButtonSearched(favorites, startArray, endArray);
    addListenerDownloadButtonHoverSearched(favorites, startArray, endArray);
};

document.getElementById("buttonViewMore").addEventListener("click", event => {
    startArray += 12;
    if((endArray+13)<favorites.length){
        endArray += 12;
    }else if((endArray+13)>=favorites.length){
        endArray = favorites.length-1;
        document.getElementById("buttonViewMore").innerHTML = "";
        document.getElementById("withResults").style.marginBottom = "50px"
    };
    createGifsSearched(favorites, startArray, endArray);
});

function newFavoriteGifSearched(gifSearchedNew, event){
    let newGif ={
        "id": gifSearchedNew.id, 
        "url": gifSearchedNew.url,
        "title": gifSearchedNew.title,
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

function addListenerLikeButtonSearched(favorites, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`addTrendSearch-${favorites[index].id}`).addEventListener("click", event => newFavoriteGifSearched(favorites[index], event));
    }
}

function expandGifToViewPortSearched(gifSearchedNew, startArray, endArray){
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementById("titleFavorites").style.display = "none";
    document.getElementById("trendingGifosTitle").style.display = "none";
    document.getElementById("sameFooter").style.display = "none";
    document.getElementById("topThreeTrendingGifos").style.display = "none";
    document.getElementById("buttonViewMore").style.display = "none";
    document.getElementsByClassName("bottomTrendinggifos")[0].style.display = "none";
    document.getElementById(`cardSearch-${gifSearchedNew.id}`).classList.replace("cardNormal", "cardExpandGridGif");
    endArray -= startArray+1;
    for (let index = 0; index <= endArray; index++) {
        document.getElementsByClassName("cardNormal")[index].style.display = "none";
    }
}

function addListenerExpandButtonSearched(favorites, startArray, endArray){
    let viewPortWidthSearched = screen.width;
    if(viewPortWidthSearched>=750){
        for (let index = startArray; index < (endArray+1); index++) {
            document.getElementById(`expandTrendSearch-${favorites[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(favorites[index], startArray, endArray));
        }
    }else if(viewPortWidthSearched<750){
        for (let index = startArray; index < (endArray+1); index++) {
            document.getElementById(`imgSearch-${favorites[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(favorites[index], startArray, endArray));
        }
    };
}

function closeExpandGifSearched(gifSearchedNew, startArray, endArray){
    document.getElementsByTagName("header")[0].style.display = "";
    document.getElementById("titleFavorites").style.display = "";
    document.getElementById("trendingGifosTitle").style.display = "";
    document.getElementById("sameFooter").style.display = "";
    document.getElementById("topThreeTrendingGifos").style.display = "";
    document.getElementById("buttonViewMore").style.display = "";
    document.getElementsByClassName("bottomTrendinggifos")[0].style.display = "";
    document.getElementById(`cardSearch-${gifSearchedNew.id}`).classList.replace("cardExpandGridGif", "cardNormal");
    endArray -= startArray;
    for (let index = 0; index <= endArray; index++) {
        document.getElementsByClassName("cardNormal")[index].style.display = "";
    }
}

function addListenerCloseExpandButtonSearched(favorites, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`closeExpandSearch-${favorites[index].id}`).addEventListener("click", event => closeExpandGifSearched(favorites[index], startArray, endArray));
    }
}

function downloadGifSearched(jsonGifsSearched){
    getBlob();
    async function getBlob(){
        const gifFetch = await fetch(jsonGifsSearched.url);
        const file = await gifFetch.blob();
        const a = document.getElementById(`downloadTrendSearch-${jsonGifsSearched.id}`);
        const urlBlob = URL.createObjectURL(file);
        a.href = urlBlob
    };
}

function addListenerDownloadButtonHoverSearched(favorites, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`cardSearch-${favorites[index].id}`).addEventListener("mouseover", event => downloadGifSearched(favorites[index]));
    }
}