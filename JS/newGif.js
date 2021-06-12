let file = null;

(function initModeimages(){
    let modeActived = localStorage.getItem("screenMode");
    if(modeActived === "day"){
        document.getElementById("movieTape").src = "../images/pelicula.svg";
        document.getElementById("cameraComplete").src = "../images/camara.svg";
    }else if (modeActived === "night"){
        document.getElementById("movieTape").src = "../images/pelicula-modo-noc.svg";
        document.getElementById("cameraComplete").src = "../images/camara-modo-noc.svg";
    };
})();

document.getElementsByClassName("nightModeAnchor")[0].addEventListener("click", event => {
    let cameraMode = document.getElementById("cameraComplete");
    if(event.target.innerText === "MODO DIURNO"){
        cameraMode.src = "../images/camara-modo-noc.svg";
        document.getElementById("movieTape").src = "../images/pelicula-modo-noc.svg";
    }else if(event.target.innerText === "MODO NOCTURNO"){
        cameraMode.src = "../images/camara.svg";
        document.getElementById("movieTape").src = "../images/pelicula.svg";
    };
})

function getStreamAndRecord () { 
    navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
       height: { max: 480 }
    }
 })
 .then(function(stream) {
    video.srcObject = stream;
    video.play()
})}

function getStreamAndRecord () { 
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
         height: "320",
         width: "480"
        }
    })
.then(function(stream) {
    const video = document.getElementsByTagName("video")[0];
    video.srcObject = stream;
    video.play()
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 30,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            startTimer();
        },
    });
    let textBeforeVideo = document.querySelectorAll("#bodyVideo p");
    textBeforeVideo[0].innerText = "";
    textBeforeVideo[1].innerText = "";
    textBeforeVideo[2].innerText = "";
    textBeforeVideo[3].innerText = "";
    document.getElementById("numberOne").classList.replace("numberIndicatorsSelected", "numberIndicators");
    document.getElementById("numberTwo").classList.replace("numberIndicators", "numberIndicatorsSelected");
    document.getElementById("createGif").innerText = "GRABAR";
    document.getElementById("createGif").style.visibility = "visible";
})}

document.getElementById("timer").addEventListener("click", event => {
    document.getElementById("createGif").innerText = "GRABAR";
    event.target.style.visibility = "hidden";
    recorder.reset(); /* This line allows to reset the file information to recepture the Gif correctly */
});

document.getElementById("createGif").addEventListener("click", event => {
    let innerTextButton = event.target.innerText;
    switch(innerTextButton){
        case"COMENZAR":
            let textBeforeVideo = document.querySelectorAll("#bodyVideo p");
            textBeforeVideo[0].innerText = "¿Nos das acceso";
            textBeforeVideo[1].innerText = "a tu cámara?"
            textBeforeVideo[2].innerText = "El acceso a tu camara será válido sólo";
            textBeforeVideo[3].innerText = "por el tiempo en el que estés creando el GIFO";
            document.getElementById("numberOne").classList.replace("numberIndicators", "numberIndicatorsSelected");
            event.target.style.visibility = "hidden";
            getStreamAndRecord();
            break;
        case "GRABAR":
            document.getElementById("createGif").innerText = "FINALIZAR";
            recorder.startRecording();
            break;
        case "FINALIZAR":
            stopTimer();
            recorder.stopRecording(() => {
                file = recorder.getBlob();
                document.getElementById("createGif").innerText = "SUBIR GIFO";
                document.getElementById("timer").innerText = "REPETIR CAPTURA";
                document.getElementById("timer").classList.replace("reloj", "repeatCapture");
            });
            break;
        case "SUBIR GIFO":
            event.target.style.visibility = "hidden";
            document.getElementById("hoverVideo").style.visibility = "visible";
            document.getElementById("numberTwo").classList.replace("numberIndicatorsSelected", "numberIndicators");
            document.getElementById("numberThree").classList.replace("numberIndicators", "numberIndicatorsSelected");
            document.getElementById("timer").style.visibility = "hidden";
            submitGif(file);
            break;
    }
});

/* Timer function in real time --------------------------------------------------------------------------------- */

function startTimer () {
    let timer = document.getElementById("timer");
    h = 0, m = 0, s = 0;
    timer.style.visibility = "visible";
    timer.classList.replace("repeatCapture", "reloj");
    timer.textContent = "00:00:00";
    timerObject = setInterval( eachSecond , 1000 );
}

function eachSecond() {
    let timer = document.getElementById("timer");

    s++;

    if (s>59){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>24){h=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}

    timer.textContent = `${hAux}:${mAux}:${sAux}`
}

function stopTimer () {
    clearInterval(timerObject);
}


/* ------------------------------------------------------------------------------------------------------------- */

/* Submit Gif -------------------------------------------------------------------------------------------------- */

function submitGif(file){
    let formdata = new FormData();
    formdata.append("api_key", "2QPzgXptcn2TEysYoWRTcHiy3pBh9G6U");
    formdata.append("file", file);
    formdata.append("username", "cristiancelis9211");

    let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://upload.giphy.com/v1/gifs", requestOptions)
    .then(response => response.json())
    .then(result => {
        let id = result.data.id;
        getInfoNewGif(id);
    })
    .catch(error => console.error('error', error));
};

function getInfoNewGif(id){
    fetch(`http://api.giphy.com/v1/gifs/${id}?api_key=2QPzgXptcn2TEysYoWRTcHiy3pBh9G6U`)
    .then(response => response.json())
    .then(result => {
        document.querySelector("#hoverVideo .icon-loader").classList.replace("icon-loader", "icon-checkmark");
        document.querySelector("#hoverVideo span:nth-child(2)").innerText = "GIFO subido con éxito";
        document.getElementsByClassName("buttonsScriptSearch")[0].style.visibility = "visible";
        let newGif = {
            "id": result.data.id,
            "url": result.data.images.original.url,
            "title": `myGif-${timeN()}`,
            "username": result.data.username
        };
        let myGifos = JSON.parse(localStorage.getItem("myGifos"));
        myGifos.push(newGif);
        localStorage.setItem("myGifos", JSON.stringify(myGifos));
        copyUrl(result.data.images.original.url);
        downloadNewGif(result.data.images.original.url, newGif.title);
    })
};

/* ------------------------------------------------------------------------------------------------------------- */

/* Get date info of Gif to put like the title ------------------------------------------------------------------ */

function timeN() {
    let time = new Date();
    return `${time.getHours()}${time.getMinutes()}${time.getSeconds()}`;
}

/* ------------------------------------------------------------------------------------------------------------- */

/* Copiar URL al cilpboard y descargar Gif --------------------------------------------------------------------- */

function copyUrl(url){
    document.getElementById("addTrendSearch").addEventListener("click", event => {
        var inputc = document.body.appendChild(document.createElement("input"));
        inputc.value = url;
        inputc.focus();
        inputc.select();
        document.execCommand('copy');
        inputc.parentNode.removeChild(inputc);
        alert("Url copiada en el portapapeles");
    });
}

function downloadNewGif (url, title){
    getBlob();
    async function getBlob(){
        const gifFetch = await fetch(url);
        const file = await gifFetch.blob();
        const a = document.getElementById(`downloadTrendSearch`);
        const urlBlob = URL.createObjectURL(file);
        a.download = title;
        a.href = urlBlob;
    };
}

/* ------------------------------------------------------------------------------------------------------------- */