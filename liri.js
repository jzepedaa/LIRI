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
            message: "what is your command",
            name: "command"
        },
        {
            type: "input",
            message: "Enter the artist, song, or movie",
            name: "info"
        }

    ]).then(function (inquirerResponse) {
        App(inquirerResponse.command, inquirerResponse.info);
    })

}

function bandName(artists) {
    var queryURL = 'https://rest.bandsintown.com/artists/' + artists + '/events?app_id=codingbootcamp';
    axios.get(queryURL)
        .then(function (response) {
            // var data = response.data;
            // console.log(response.events[0])
            for (let i = 0; i < response.data.length; i++) {
                var show = response.data[i];
                console.log("Name: ", show.venue.name);
                console.log("Location: ", show.venue.city || show.venue.region || show.venue.country);
                console.log("Date: ", moment(show.datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}
// bandName("eminem")



function readSpotify(song) {
    spotify
        .search({
            type: 'track', query: song
        })
        .then(function (response) {
            // console.log("My song: ", song, "and data: ", response);
            console.log("Name: ", response.tracks.items[0].name);
            console.log("Artist(s): ", response.tracks.items[0].album.artists[0].name);
            // the preview URL was null for some songs, so I made another option just in case
            console.log("Preview Link: ", response.tracks.items[0].preview_url || response.tracks.items[0].external_urls.spotify);
            console.log("Album: ", response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// readSpotify();


function getMovie(movie) {
    var queryURL = 'https://www.omdbapi.com/?t=' + movie + '&apikey=trilogy';
    // console.log("this is the url: ", queryURL1);
    axios.get(queryURL)
        .then(function (response) {
            // console.log(response.data);
            var movieD = response.data;
            console.log("Name: ", response.data.Title);
            console.log("Year: ", movieD.Year);
            console.log("IMDB Rating: ", movieD.Ratings[0].Value);
            console.log("IMDB Rating: ", movieD.Ratings[1].Value);
            console.log("Country: ", movieD.Country);
            console.log("Language: ", movieD.Language);
            console.log("Plot: ", movieD.Plot);
            console.log("Actors: ", movieD.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}
// getMovie();

function App(command, info) {
    switch (command) {
        case "concert-this":
            if (info === "") {
                console.log("Default: ")
                bandName("Eminem")
            } else {
                bandName(info);
            }
            break;
        case "spotify-this-song":
            if (info === "") {
                readSpotify("Stan");
            } else {
                readSpotify(info);
            }
            break;
        case "movie-this":
            if (info === "") {
                getMovie("Spider Man");
            } else {
                getMovie(info);
            }
            break;
        case "do-what-it-says":
            // console.log("do it!");
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
            console.log("default");

    }

}

setTimeout(inquiry);









// var readSpotify = function (nameOfSong) {
//     spotify.search({
//         type: "track",
//         query: nameOfSong
//     },
//         function (err, response) {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             console.log(response.tracks.items[0].name);
//         }
//     );
// };








// // var pick = function (caseData, functionData) {
// //     if (caseData === "spotify-this-song") {
// //         readSpotify(functionData);
// //     }
// // };

// // var info = function (argOne, argTwo) {
// //     pick(argOne, argTwo);
// // }
// // info(process.argv[2], process.argv.slice(3).join(" "));


// // console.log(process.argv[2], process.argv.slice(3).join(" "));
// var one = process.argv[2];
// var two = process.argv[3];
// var runThis = function (one, two) {
//     console.log(one, two);
//     if (one === "spotify-this-song") {
//         readSpotify(two);

//     } else if (one === "concert-this") {
//         bandName(two);

//     }
// };

// runThis(one, two);