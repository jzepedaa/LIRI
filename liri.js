require("dotenv").config();

var keys = require("./keys.js")

var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require("fs");
var axios = require("axios");

// var spotify = new Spotify(keys.spotify);
// console.log(keys.spotify)