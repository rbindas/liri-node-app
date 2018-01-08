var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitterKeys);

var action = process.argv[2];
var value = process.argv[3];

//switch function
switch (action) {

    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        doit();
        break;



}


//    ---------------FUNCTIONS----------------

//-----------TWITTER FUNCTION---------------------------
function tweets() {

    var params = { screen_name: '@pistacchi12' };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log(err);
        }
        for (var i = 0; i < tweets.length; i++) {
            console.log((tweets[i].text) + " created on " + (tweets[i].created_at));
        }
    });

};


//-----------SPOTIFY FUNCTION---------------------------

function spotifyThis() {
    var spotify = new Spotify({
        id: 'f36b7a077a234967847eeb3d7fcd0886',
        secret: 'e786f781029941b4b1942f870ab0dcdd'
    });
    //query for "The Sign" of Ace of Base if no user input available
    if (!value) {
        value = "The Sign";
    };

    spotify.search({ type: 'track', query: value, limit: 1 }, function(err, data) {
        if (err) {
            console.log('Error occurred: ', err);
        } else {
            // console.log(data);
            var songs = data.tracks.items;
            // console.log(songs);
            console.log("The artists: " + songs[0].artists[0].name);
            console.log("The song's name: " + songs[0].name);
            console.log("A preview link from Spotify: " + songs[0].preview_url);
            console.log("The album name: " + songs[0].album.name);

            //Append results to a file
            fs.appendFile("spotify.txt", "The artist: " + songs[0].artists[0].name + "\r\n" + "The song name: " +  songs[0].name 
             + "\r\n" + "Album name: "  + songs[0].album.name + "\r\n" + "A preview link from Spotify: " + songs[0].preview_url +
             "\r\n" + "====================================================" + "\r\n", 
                function(err) { 
                    if (err) { 
                        return console.log(err);
                    }
                });

           
        }
    });
}

//-----------MOVIE FUNCTION---------------------------

function movie() {

    //default to Mr. Nobody movie
    if (!value) {
        value = "Mr. Nobody";
    };
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            var movieTitle = JSON.parse(body).Title;
            var year = JSON.parse(body).Year;
            var IMDBRating = JSON.parse(body).imdbRating;
            var tomato = JSON.parse(body).Ratings[1].Value;
            var country = JSON.parse(body).Country;
            var language = JSON.parse(body).Language;
            var plot = JSON.parse(body).Plot;
            var actors = JSON.parse(body).Actors;

            console.log("Title of the movie: " + movieTitle);
            console.log("Year the movie came out: " + year);
            console.log("IMDB Rating: " + IMDBRating);
            console.log("Rotten Tomatoes Rating: " + tomato);
            console.log("Country where the movie was produced: " + country);
            console.log("Language of the movie: " + language);
            console.log("Plot: " + plot);
            console.log("Actors: " + actors);


            //Append results to a file
                fs.appendFile("movie.txt", "MOVIE INFO: \r\n" + "Title: " + movieTitle + "\r\n" + "Year the movie came out: " + year 
                    + "\r\n" + "IMDB Rating: "  + IMDBRating + "\r\n" + "Country where movie was produced: " + country + "\r\n" + "Language of Movie: " + language + "\r\n" + "Plot of the Movie: " + plot + "\r\n" + "Actors in the movie: " + actors + "\r\n" +
                    "Rotten Tomatoes Rating: " + tomato + "\r\n" + "====================================================\r\n", 
                function(err) { 
                    if (err) { 
                        return console.log(err);
                    }
                });

                    

        }
    });
}

//-----------DO IT FUNCTION---------------------------

function doit() {

    fs = require("fs");
   
    fs.readFile("random.txt", 'utf8', function(error, data) {
        
        //console.log(data);

        if (error) {
            return console.log(error);
        }


        var dataArr = data.split(",");

        console.log(dataArr);
        

        if (dataArr === "spotify-this-song") {
            spotifyThis();
        } else if (dataArr === "movie-this") {
            movie();
        } else {
            tweets();
        };

        
        
  });
}