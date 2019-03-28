require("dotenv").config();

var keys = require("./keys.js")

var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require("fs");
var axios = require("axios");


var spotify = new Spotify(keys.spotify);
// console.log(keys.spotify);

var command;
var params;

function inquiry() {
    inquirer.prompt([
        {
            type: "input",
            message: "Type your command `do-what-it-says`, `movie-this`, `spotify-this-song`, `concert-this`: ",
            name: "command"
        },
        {
            type: "input",
            message: "Type the Artist, Song, or Movie: ",
            name: "text"
        }

    ]).then(function (inquirerResponse) {
        App(inquirerResponse.command, inquirerResponse.text);
    })

}
//Bands in town
function bandName(artists) {
    var queryURL = 'https://rest.bandsintown.com/artists/' + artists + '/events?app_id=codingbootcamp';
    axios.get(queryURL)
        .then(function (response) {
            // console.log(response)
            for (let i = 0; i < response.data.length; i++) {

                console.log("Name: ", response.data[i].venue.name);
                console.log("Location: ", response.data[i].venue.city);
                console.log("Date: ", moment(response.data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}



//spotify
function readSpotify(song) {
    spotify
        .search({
            type: 'track', query: song
        })
        .then(function (response) {
            // console.log(response)
            console.log("Name: ", response.tracks.items[0].name);
            console.log("Artist(s): ", response.tracks.items[0].album.artists[0].name);
            console.log("Preview Link: ", response.tracks.items[0].preview_url);
            console.log("Album: ", response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}



//movies
function getMovie(movie) {
    var queryURL = 'https://www.omdbapi.com/?t=' + movie + '&apikey=trilogy';
    axios.get(queryURL)
        .then(function (response) {
            // console.log(response.data);

            console.log("Name: ", response.data.Title);
            console.log("Year: ", response.data.Year);
            console.log("IMDB Rating: ", response.data.Ratings[0].Value);
            console.log("IMDB Rating: ", response.data.Ratings[1].Value);
            console.log("Country: ", response.data.Country);
            console.log("Language: ", response.data.Language);
            console.log("Plot: ", response.data.Plot);
            console.log("Actors: ", response.data.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}


//main function with users input
function App(command, text) {
    switch (command) {
        case "concert-this":
            if (text === "") {

                bandName("Eminem")
            } else {
                bandName(text);
            }
            break;
        case "spotify-this-song":
            if (text === "") {
                readSpotify("Stan");
            } else {
                readSpotify(text);
            }
            break;
        case "movie-this":
            if (text === "") {
                getMovie("Spider Man");
            } else {
                getMovie(text);
            }
            break;
        case "do-what-it-says":

            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) throw err;
                const dataArray = data.split(",");
                for (let i = 0; i < dataArray.length; i++) {
                    command = dataArray[i]; i++;
                    params = dataArray[i];
                };
                App(command, params);
            });

            break;
        default:

            console.log("Something went wrong");

    }

}
//call to start inquiry
inquiry();