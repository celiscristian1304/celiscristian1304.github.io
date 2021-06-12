(function () {
    if("screenMode" in localStorage){

    }else{
        localStorage.setItem("screenMode", "day");
    };
    document.addEventListener("DOMContentLoaded", event => {
        const body = document.body;
        const spanMode = document.getElementsByClassName("nightModeAnchor");
        if(localStorage.getItem("screenMode")==="day"){
            body.classList.replace("nightColors", "dayColors");
        }else if(localStorage.getItem("screenMode")==="night"){
            body.classList.replace("dayColors", "nightColors");
            spanMode[0].innerHTML = "modo diurno";
        };
    });
})();

(function () {
    if("favorites" in localStorage){

    }else{
        localStorage.setItem("favorites", JSON.stringify([]));
    };
    if("myGifos" in localStorage){

    }else{
        localStorage.setItem("myGifos", JSON.stringify([]));
    }
})();

const nightModeFunction = document.getElementsByClassName("nightModeAnchor");
nightModeFunction[0].addEventListener("click", event => {
    const body = document.body;
    if(localStorage.getItem("screenMode")==="day"){
        body.classList.replace("dayColors", "nightColors");
        event.target.innerHTML = "modo diurno";
        localStorage.setItem("screenMode", "night");
    }else if(localStorage.getItem("screenMode")==="night"){
        body.classList.replace("nightColors", "dayColors");
        event.target.innerHTML = "modo nocturno";
        localStorage.setItem("screenMode", "day");
    };
});