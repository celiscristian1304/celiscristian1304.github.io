let startArray = 0;
let endArray = 11;
let myGifos = JSON.parse(localStorage.getItem("myGifos"));
(function searchGifs(){
    if(myGifos.length === 0){
        drawWithOutMyGifos();
    }else{
      if(myGifos.length <= 12){
        createGifsSearched(myGifos, startArray, (myGifos.length-1));
        document.getElementById("withResults").style.marginBottom = "50px"
      }else{
        createGifsSearched(myGifos, startArray, endArray);
        document.getElementById("buttonViewMore").innerHTML = `<button id="viewMore">VER MÁS</button>`;
      }
    };
})();

function drawWithOutMyGifos(){
    document.getElementById("withoutResults").innerHTML = `
        <img src="../images/icon-mis-gifos-sin-contenido.svg" alt="My Gifos sin contenido">
        <p>"¡Anímate a crear tu primer GIFO!"</p>
    `;
}

function createGifsSearched(myGifos, startArray, endArray){
    let divGifosToShow = document.getElementById("gifsToShow");
    let htmlGifosToShow = "";
    /* let heartButton = ""; */
    for (let index = startArray; index < (endArray+1); index++) {
        /* Verify if a gif exist in favorite pages */
        /* let existGif = myGifos.filter(element => element.id === jsonGifsSearched.data[index].id);
        if(existGif.length === 0){
            heartButton = `<span class="icon-heart-o"></span>`;
        }
        else{
            heartButton = `<span class="icon-heart"></span>`;
        } */
        /* The following code line allow to extract the exact title's Gif */
        htmlGifosToShow += `
        <div id="cardSearch-${myGifos[index].id}" class="cardNormal">
            <span class="buttonCloseExpandSearch" id="closeExpandSearch-${myGifos[index].id}">X</span>
            <img id="imgSearch-${myGifos[index].id}" src="${myGifos[index].url}" alt="${myGifos[index].title}">
            <div class="hoverColorSearch"></div>
            <div class="buttonsScriptSearch">
                <button class="likeScriptSearch" id="addTrendSearch-${myGifos[index].id}">
                    <span class="icon-trash-2"></span>
                </button>
                <a class="downloadScriptSearch" id="downloadTrendSearch-${myGifos[index].id}" download="${myGifos[index].title}">
                    <span class="icon-download"></span>
                </a>
                <button class="expandScriptSearch" id="expandTrendSearch-${myGifos[index].id}">
                    <span class="icon-expand"></span>
                </button>
            </div>
            <div class="infoGifSearch">
                <h4>${myGifos[index].username}</h4>
                <h3>${myGifos[index].title}</h3>
            </div>
        </div>
        `;
    }
    divGifosToShow.innerHTML = htmlGifosToShow;
    addListenerLikeButtonSearched(myGifos, startArray, endArray);
    addListenerExpandButtonSearched(myGifos, startArray, endArray);
    addListenerCloseExpandButtonSearched(myGifos, startArray, endArray);
    addListenerDownloadButtonHoverSearched(myGifos, startArray, endArray);
};

document.getElementById("buttonViewMore").addEventListener("click", event => {
    startArray += 12;
    if((endArray+13)<myGifos.length){
        endArray += 12;
    }else if((endArray+13)>=myGifos.length){
        endArray = myGifos.length-1;
        document.getElementById("buttonViewMore").innerHTML = "";
        document.getElementById("withResults").style.marginBottom = "50px"
    };
    createGifsSearched(myGifos, startArray, endArray);
});

function newFavoriteGifSearched(gifSearchedNew, event){
    let newGif ={
        "id": gifSearchedNew.id, 
        "url": gifSearchedNew.url,
        "title": gifSearchedNew.title,
        "username": gifSearchedNew.username
    };
    let myGifos = JSON.parse(localStorage.getItem("myGifos"));
    let existGif = myGifos.filter(element => element.id === newGif.id);
    if(existGif.length === 0){
        event.target.classList.replace("icon-heart-o", "icon-trash-2");
        event.target.innerHTML = `<span class="icon-trash-2"></span>`;
        myGifos.push(newGif);
    }else{
        let indexOfElemetArray = 0;
        event.target.classList.replace("icon-trash-2", "icon-heart-o");
        event.target.innerHTML = `<span class="icon-heart-o"></span>`;
        /* The following line code extract the index of the element array with specific id */
        indexOfElemetArray = myGifos.map(function(e){return e.id;}).indexOf(newGif.id);
        /* Now, with the index, is possible to remove the element */
        myGifos.splice(indexOfElemetArray,1);
    }
    localStorage.setItem("myGifos", JSON.stringify(myGifos));
}

function addListenerLikeButtonSearched(myGifos, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`addTrendSearch-${myGifos[index].id}`).addEventListener("click", event => newFavoriteGifSearched(myGifos[index], event));
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

function addListenerExpandButtonSearched(myGifos, startArray, endArray){
    let viewPortWidthSearched = screen.width;
    if(viewPortWidthSearched>=750){
        for (let index = startArray; index < (endArray+1); index++) {
            document.getElementById(`expandTrendSearch-${myGifos[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(myGifos[index], startArray, endArray));
        }
    }else if(viewPortWidthSearched<750){
        for (let index = startArray; index < (endArray+1); index++) {
            document.getElementById(`imgSearch-${myGifos[index].id}`).addEventListener("click", event => expandGifToViewPortSearched(myGifos[index], startArray, endArray));
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

function addListenerCloseExpandButtonSearched(myGifos, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`closeExpandSearch-${myGifos[index].id}`).addEventListener("click", event => closeExpandGifSearched(myGifos[index], startArray, endArray));
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

function addListenerDownloadButtonHoverSearched(myGifos, startArray, endArray){
    for (let index = startArray; index < (endArray+1); index++) {
        document.getElementById(`cardSearch-${myGifos[index].id}`).addEventListener("mouseover", event => downloadGifSearched(myGifos[index]));
    }
}