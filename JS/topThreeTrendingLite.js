const urlTrending = "https://api.giphy.com/v1/gifs/trending";
const apiKeyTrendingThreeGifs = "2QPzgXptcn2TEysYoWRTcHiy3pBh9G6U";
const limit = 3;

(async function() {
    let viewPortWidth = screen.width;
    try {
        const fetchResults = await fetch(`${urlTrending}?api_key=${apiKeyTrendingThreeGifs}&limit=${limit}`);
        const jsonTrending = await fetchResults.json();
        createTrendingGifos(jsonTrending);
        addListenerLikeButton(jsonTrending);
        addListenerExpandButton(jsonTrending, viewPortWidth);
        addListenerCloseExpandButton(jsonTrending);
        addListenerDownloadButtonHover(jsonTrending);
    } catch (error) {
        console.error(error, "No se pudo acceder a la página de Giphy");
    };
})();

function createTrendingGifos(jsonTrending){
    let divTopThreeTrendingGifos = document.getElementById("gifsTrendingGifos");
    let htmlTopThreeTrendingGifos = "";
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    let heartButton = "";
    for (let index = 0; index < jsonTrending.data.length; index++) {
        /* Verify if a gif exist in favorite pages */
        let existGif = favorites.filter(element => element.id === jsonTrending.data[index].id);
        if(existGif.length === 0){
            heartButton = `<span class="icon-heart-o"></span>`;
        }
        else{
            heartButton = `<span class="icon-heart"></span>`;
        }
        /* The following code line at js38 allow to extract the exact title's Gif */
        htmlTopThreeTrendingGifos += `
        <div id="card-${jsonTrending.data[index].id}" class="card">
            <span class="buttonCloseExpand" id="closeExpand-${jsonTrending.data[index].id}">X</span>
            <img id="img-${jsonTrending.data[index].id}" src="${jsonTrending.data[index].images.original.url}" alt="${jsonTrending.data[index].title.substring(0, jsonTrending.data[index].title.indexOf("GIF")-1)}">
            <div class="hoverColor"></div>
            <div class="buttonsScript">
                <button class="likeScript" id="addTrend-${jsonTrending.data[index].id}">
                    ${heartButton}
                </button>
                <a class="downloadScript" id="downloadTrend-${jsonTrending.data[index].id}" download="${jsonTrending.data[index].title.substring(0, jsonTrending.data[index].title.indexOf("GIF")-1)}">
                    <span class="icon-download"></span>
                </a>
                <button class="expandScript" id="expandTrend-${jsonTrending.data[index].id}">
                    <span class="icon-expand"></span>
                </button>
            </div>
            <div class="infoGif">
                <h4>${jsonTrending.data[index].username}</h4>
                <h3>${jsonTrending.data[index].title.substring(0, jsonTrending.data[index].title.indexOf("GIF")-1)}</h3>
            </div>
        </div>
        `;
    }
    divTopThreeTrendingGifos.innerHTML = htmlTopThreeTrendingGifos;
};

function newFavoriteGif(trendingObjectTopThree, event){
    let newGif ={
        "id": trendingObjectTopThree.id, 
        "url": trendingObjectTopThree.images.original.url,
        "title": trendingObjectTopThree.title.substring(0, trendingObjectTopThree.title.indexOf("GIF")-1),
        "username": trendingObjectTopThree.username
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

function addListenerLikeButton(jsonTrending){
    for (let index = 0; index < jsonTrending.data.length; index++) {
        document.getElementById(`addTrend-${jsonTrending.data[index].id}`).addEventListener("click", event => newFavoriteGif(jsonTrending.data[index], event));
    }
}

function expandGifToViewPort(trendingObjectTopThree){
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementById("titleFavorites").style.display = "none";
    document.getElementById("trendingGifosTitle").style.display = "none";
    document.getElementById("sameFooter").style.display = "none";
    document.getElementById("gifsSearched").style.display = "none";
    document.getElementById(`card-${trendingObjectTopThree.id}`).classList.replace("card", "cardExpand");
    
}

function addListenerExpandButton(jsonTrending, viewPortWidth){
    if(viewPortWidth>=750){
        for (let index = 0; index < jsonTrending.data.length; index++) {
            document.getElementById(`expandTrend-${jsonTrending.data[index].id}`).addEventListener("click", event => expandGifToViewPort(jsonTrending.data[index]));
        }
    }else if(viewPortWidth<750){
        for (let index = 0; index < jsonTrending.data.length; index++) {
            document.getElementById(`img-${jsonTrending.data[index].id}`).addEventListener("click", event => expandGifToViewPort(jsonTrending.data[index]));
        }
    };
}

function closeExpandGif(trendingObjectTopThree){
    document.getElementsByTagName("header")[0].style = "";
    document.getElementById("titleFavorites").style = "";
    document.getElementById("trendingGifosTitle").style = "";
    document.getElementById("sameFooter").style = "";
    document.getElementById("gifsSearched").style.display = "";
    document.getElementById(`card-${trendingObjectTopThree.id}`).classList.replace("cardExpand", "card");
}

function addListenerCloseExpandButton(jsonTrending){
    for (let index = 0; index < jsonTrending.data.length; index++) {
        document.getElementById(`closeExpand-${jsonTrending.data[index].id}`).addEventListener("click", event => closeExpandGif(jsonTrending.data[index]));
    }
}

function downloadGif(jsonTrending){
    getBlob();
    async function getBlob(){
        const gifFetch = await fetch(jsonTrending.images.original.url);
        const file = await gifFetch.blob();
        const a = document.getElementById(`downloadTrend-${jsonTrending.id}`);
        const urlBlob = URL.createObjectURL(file);
        a.href = urlBlob
    };
}

function addListenerDownloadButtonHover(jsonTrending){
    for (let index = 0; index < jsonTrending.data.length; index++) {
        document.getElementById(`card-${jsonTrending.data[index].id}`).addEventListener("mouseover", event => downloadGif(jsonTrending.data[index]));
    }
}