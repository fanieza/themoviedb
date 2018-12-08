//my theMovieDB.org api key
const movieDBApiKey = "f7f9fe195f863c63a5e2f42428f3c16b"

// Selectors
var topTiles = document.querySelectorAll(".tile-top");
var startImg = document.querySelector("#startActorImage");
var startName = document.querySelector("#startActorName");
var finishImg = document.querySelector("#finishActorImage");
var finishName = document.querySelector("#finishActorName")
var creditsClassBox = document.querySelector(".credits-cast-box")
var nav = document.querySelector(".nav")
var credits = document.querySelector(".credits")
var degreeCount = document.querySelector(".degreeCount")
var hint = document.querySelector(".hint")
var li = document.querySelectorAll("li")

//combines list of actors from actors.js into single array
var allActors = [...famousFifty, ...famousOneHundred, ...recentOneHundred, ...fiftyBlackActors, ...actressOfColorArray, ...actorsOfColorArray]

//hard coded actor for testing
var myActor = "Samuel Jackson"

//random actor string from allActors array
function randomActor() {
    return allActors[Math.floor(Math.random() * allActors.length)]
}

//URL functions for API endpoint requests
function actorURL(actorString) {
    return `https://api.themoviedb.org/3/search/person?api_key=${movieDBApiKey}&language=en-US&query=${actorString}&page=1&include_adult=false`
}

// Links

nav.addEventListener('click', function (){
    credits.classList.addClass('selected')
    degreeCount.classList.removeClass('selected')
    hint.classList.removeClass('selected')
})

function actorCreditsURL(id) {
    return `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${movieDBApiKey}&language=en-US`
}

function movieCreditsURL(id) {
    return `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${movieDBApiKey}`
}

function tvCreditsURL(id) {
    return `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${movieDBApiKey}&language=en-US`
}

class Actor {
    constructor(id, name, profile_path, face, portrait) {
        this.id = id;
        this.name = name;
        this.profile_path = profile_path;
    }
    face_url() {
        return `https://image.tmdb.org/t/p/w235_and_h235_face${this.profile_path}`;
    }

    portrait_url() {
        return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${this.profile_path}`;
    }

    async getCredits() {
        return await fetch(actorCreditsURL(this.id))
            .then(res => res.json())
            .then(credits => credits.cast)
            .then(credits => creditFilters(credits, this.name))
            .then(credits => credits.map(function (credit) {
                if (credit.media_type === "movie") {
                    if(!credit.poster_path){
                        credit.poster_path = "images/no-poster-movie.jpg"
                    } else {
                        credit.poster_path = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${credit.poster_path}`
                    }
                    return new Credit(credit.id, "movie", credit.title, credit.poster_path)
                } else {
                    if(!credit.poster_path){
                        credit.poster_path = "images/no-poster-tv.jpg"
                    } else {
                        credit.poster_path = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${credit.poster_path}`
                    }
                    return new Credit(credit.id, "tv", credit.name, credit.poster_path)
                }
            }))
            
    }
    

    // function createStartTile(){
    //     var startActor = randomActor(getActor());
    //     startImg.setAttribute("src", this.face_url())
    //     startName.innerHTML = this.name
    // }


    
    // function createStartTile(){
    //     startImg.setAttribute("src", this.face_url())
    //     startName.innerHTML = this.name
    // }
    
    // function createFinishTile(){
    //     finishImg.setAttribute("src", this.face_url())
    //     finishName.innerHTML = this.name
    // }
    

    // createStartTile(){
    //     var startActor = getActor(randomActor);
    //     new Actor
    //     .then(function(actor){
    //         return data.startActor;
    //     })
    //     return new Actor;
    // }

    // createCreditsTile(){

    // } 

    createActorMainTile() {
        //creates a new div to set custom elements inside for a main tile
        let mainTile = document.createElement("div")
        // saves the Actor object 'this' to use in an inner function (closure)
        let self = this
        // set attributes of the new div
        mainTile.setAttribute("class", "tile")
        //set a unique id based on the media id
        mainTile.setAttribute("id", this.id)
        //set the inner HTML with the specific img src and name
        mainTile.innerHTML = `<div class="tile-image-box">
        <img src="${this.portrait_url}"            alt="" class="tile-image">
    </div>
    <div class="tile-text-box">
        <div class="tile-main">${this.name}</div>
        <div class="tile-detail">2014 - 2018 and more and more and more</div>`
        //add the tile to the display area for cast and credits
        displayCastCredits.appendChild(mainTile)
        //add a listener to the tile using the unique id
        document.getElementById(this.id).addEventListener("click", function () {
            //clear the displayCastCredits div of the credits tiles
            clearCreditsBox()
            //call 'this' Actor and create the startTile  
            self.createStartTile()
            //call 'this' Actor and getCredits 
            //then loop through those credits and for each create a Credit mainTile
            self.getCredits()
                .then(credits => credits.forEach(credit => credit.createCreditsTile()))
            //add 'this' Actor to the gameData object's degreePath array
            gameData.degreePath.push(self)
        })
       
    }

    createStartTile(){
        startImg.setAttribute("src", this.face_url())
        startName.innerHTML = startActor
    }

    createFinishTile(){
        finishImg.setAttribute("src", this.face_url())
        finishName.innerHTML = this.name
    }

}

function clearCreditsBox(){
    while(creditsClassBox.firstChild){
        creditsClassBox.removeChild(creditsClassBox.firstChild)
    }
}

function clearTopTiles(){
    while(topTiles.firstChild){
        topTiles.removeChild(topTiles.firstChild)
    }
}


// set image and name of start and finish actors


// function createStartTile(){
//     startImg.setAttribute("src", this.face_url())
//     startName.innerHTML = startActor
// }

// function createFinishTile(){
//     finishImg.setAttribute("src", this.face_url())
//     finishName.innerHTML = this.name
// }

var startActor = randomActor(getActor());
var finishActor = randomActor(getActor());



async function getActor(actorString) {
    return await fetch(actorURL(actorString))
        .then(res => res.json())
        .then(data => data.results[0])
        .then(data => new Actor(data.id, data.name, data.profile_path))
}

class Credit {
    constructor(id, media_type, title, poster_path) {
        this.id = id;
        this.media_type = media_type;
        this.title = title;
        this.poster_path = poster_path;
    }
    async getCast() {
        if (this.media_type === "movie") {
            return await fetch(movieCreditsURL(this.id))
                .then(res => res.json())
                .then(credits => credits.cast)
                .then(cast => cast.map(castmember => new Actor(castmember.id, castmember.name, `https://image.tmdb.org/t/p/w300_and_h450_bestv2${castmember.profile_path}`)))
        } else {
            return await fetch(tvCreditsURL(this.id))
                .then(res => res.json())
                .then(credits => credits.cast)
                .then(cast => cast.map(castmember => new Actor(castmember.id, castmember.name, `https://image.tmdb.org/t/p/w300_and_h450_bestv2${castmember.profile_path}`)))
        }

    }

    createCreditsTile() {
        //creates a new div to set custom elements inside for a main tile
        let mainTile = document.createElement("div")
        // saves the Actor object 'this' to use in an inner function (closure)
        let self = this
        // set attributes of the new div
        mainTile.setAttribute("class", "tile")
        //set a unique id based on the media id
        mainTile.setAttribute("id", this.id)
        //set the inner HTML with the specific img src and name
        mainTile.innerHTML = `<div class="tile-image-box">
        <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${this.poster_path}" alt="" class="tile-image">
    </div>
    <div class="tile-text-box">
        <div class="tile-main">${this.title}</div>`
        //add the tile to the display area for cast and credits
        displayCastCredits.appendChild(mainTile)
        //add a listener to the tile using the unique id
        document.getElementById(this.id).addEventListener("click", function () {
            //clear the displayCastCredits div of the credits tiles
            clearCreditsBox()
            //call 'this' Actor and create the startTile
            self.createStartTile()
            //call 'this' Actor and getCredits 
            //then loop through those credits and for each create a Credit mainTile
            self.getCredits()
                .then(credits => credits.forEach(credit => credit.createMainTile()))
            //add 'this' Actor to the gameData object's degreePath array
            gameData.degreePath.push(self)
        })
    }
}

function creditFilters(arr, actorName) {
    return arr.filter(function(credit){
        var chars = [actorName, "", "Himself", "Herself", "Narrator (voice)", "Narrator", "(voice)", "Himself (archive footage)", "Herself (archive footage)", "Narratore", "(Voice)", "Host"]
        if(credit.vote_count < 20){
            return false;
        } else if(chars.indexOf(credit.character) > -1) {
            return false;
        } else if(credit.media_type === "tv" && credit.episode_count < 5){
            return false;
        } else {
            return true;
        }
    })
}

function startGame(){
    // clear credits div
    clearCreditsBox();
    clearTopTiles();
    // get random actor
    console.log (startActor)
    // .then()
    // display actor image and name
    createStartTile();
}

startGame();

//some testing
var johnCusack = getActor("John Cusack")
var johnCusackCredits = johnCusack.then(actor => actor.getCredits())
var johnCusackFirstCreditCastMembers = johnCusackCredits.then(credits => credits[0]).then(credit => credit.getCast())
var johnCusackCreditsCastMembers = johnCusackCredits.then(credits => credits.map(credit => credit.getCast()))