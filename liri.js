//get input from the user
var inputcatagory = process.argv[2];
var requiredinfo =process.argv.slice(3).join(" ");

//load npm package for the given api ,file system and api keys
var request = require ('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var result =require("dotenv").config();
var keys=require("./keys.js");
var fs = require('fs'); 

//to get the key for spotify and tweeter
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//check dotenv file loading
if(result.error){
    throw result.error;
}
 
    // console.log(result.parsed);
    // console.log( "\n\n");
    // console.log(keys);
    // console.log("\n\n");
    var params = {screen_name: 'nodejs',
        count:20
    };

//if user gives the required parameter it calls the function related to that input 

if(inputcatagory == "my-tweets"){
    my_tweets();
}else if(inputcatagory == "spotify-this-song"){
    spotify_this_song(requiredinfo);
}else if(inputcatagory == "movie-this"){
    movie_this();
}else if(inputcatagory == "do-what-it-says"){
     do_what_it_says();
}
////////////////////////////// MY TWEETS FUNCTION //////////////////////////////////////
//function to get 20 resent tweets and append to log.txt file 

function my_tweets(){
    
    //get list of tweets 
    client.get('favorites/list',params, function(err, tweets, response) {
        //if not error 
        if(!err){
            //append title and date of the log.txt 
            fs.appendFile("log.txt",("\n\n"+"********  LOG MY TWEEETS  **********"+"\n\n"+"*********    "+
            Date()+"    ********"+"\n\n"+inputcatagory+"\n"+ requiredinfo+"\n\n" ), function(err) {
            if(err) throw err;
            });
            //to list tweets in numbered order and log in node   
            for(var i=0; i < tweets.length; i++){
                    var j=i+1;
                    
                    console.log([j] + '. ' + tweets[i].text);
                //append tweets list in log.txt   
                fs.appendFile("log.txt",(j + ". Tweet: "+ tweets[i].text ) +"\n", function(err) {
                    if(err) throw err;
                });
            }
    
        } 
        
    });
    
}

////////////////////////  MOVIE THIS  ///////////////////////////
//function to get the required movie info

function movie_this(){

    // Grab the requiredinfo which will always be the third node argument.
var input;
    if(!requiredinfo){
        requiredinfo="Mr.Nobody";
        input= "Default : ";
    }else{
        requiredinfo=process.argv.slice(3).join(" ");
        input= "user input : ";
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + requiredinfo + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            fs.appendFile("log.txt",("\n\n"+"********  LOG MOVIE  **********"+"\n\n"+"*********    "+
            Date()+"    ********"+"\n\n" + "user input : " + inputcatagory+"\n"  + input + requiredinfo+"\n\n" ), function(err) {
            if(err) throw err;
            });
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            var jsonmovie=JSON.parse(body);
            console.log("Title : " + jsonmovie.Title);
            console.log("Release Year  : " + jsonmovie.Year);
            console.log("Rrating : "+ jsonmovie.Rated);
            console.log("Rotten tomatoes Ratings : "+ jsonmovie.Ratings[1].Value);
            console.log("Country where the movie was produced : "+ jsonmovie.Country);
            console.log("Language : "+ jsonmovie.Language);
            console.log("Plotes : "+ jsonmovie.Plot);
            console.log("Actores : "+ jsonmovie.Actors);
            fs.appendFile("log.txt",("Title : " + jsonmovie.Title+"\n" + "Release Year  : " + jsonmovie.Year + "\n" +
            "Rrating : " + jsonmovie.Rated + "\n" +"Rotten tomatoes Ratings : " + jsonmovie.Ratings[1].Value + "\n"+
            "Country where the movie was produced : "+ jsonmovie.Country + "\n" + "Language : "+ jsonmovie.Language + "\n"+
            "Plotes : " + jsonmovie.Plot +"\n" + "Actores : " + jsonmovie.Actors ) , function(err) {
                if(err) throw err;
            });
            
        }
    });
}


//////////////////////////////  SPOTIFY THIS SONG ///////////////////////////////
//function to get song information from song input parameter 

function spotify_this_song(requiredinfo){
    
   
    if(!requiredinfo){
        
           
 spotify
  .search({ type: 'track', query: 'ace of base' })
  .then(function(response) {
    fs.appendFile("log.txt",("\n\n"+ "********  LOG SONG INFO  **********"+"\n\n"+""+"\n"+"*********    "+
    Date()+"    ********"+"\n"+"user input : "+inputcatagory+"\n"+ "Default : The sign"+"\n\n" ), function(err) {
    if(err) throw err;
    });
    var json=response;
   
    console.log("--------------------------------------");
    console.log("Artist(s) : "+ json.tracks.items[0].artists[0].name);
    console.log("The song's name : "+json.tracks.items[0].name);
    console.log("A preview link of the song : "+json.tracks.items[0].external_urls.spotify);
    console.log("The album that the song is from : "+json.tracks.items[0].album.name); 
    // append user request  to log.txt 
    fs.appendFile("log.txt",("Artist(s) : "+ response.tracks.items[0].artists[0].name +"\n" + 
            "The song's name : "+ response.tracks.items[0].name + "\n" +
            "A preview link of the song : "+ response.tracks.items[0].external_urls.spotify + "\n" +
            "The album that the song is from : "+response.tracks.items[0].album.name + "\n"
        ) , function(err) {
            if(err) throw err;
    });

  })
  .catch(function(err) {
    console.log(err);
  });
       
    }else if(requiredinfo){
        fs.appendFile("log.txt",("\n"+"********  LOG SONG INFO  **********"+"\n\n"+""+"\n"+"*********    "+
            Date()+"    ********"+"\n"+"user input   : "+inputcatagory+"\n"+ "parameters : from random.txt" +"\n\n" ), function(err) {
            if(err) throw err;
        });
         
        spotify.search({ type: 'track', query: requiredinfo }).
        then(function(response){
            
             console.log("\n");
             console.log("Artist(s) : "+ response.tracks.items[0].artists[0].name);
             console.log("The song's name : "+ response.tracks.items[0].name);
             console.log("A preview link of the song : "+ response.tracks.items[0].external_urls.spotify);
             console.log("The album that the song is from : "+response.tracks.items[0].album.name);

            fs.appendFile("log.txt",("Artist(s) : "+ response.tracks.items[0].artists[0].name +"\n" + 
            "The song's name : "+ response.tracks.items[0].name + "\n" +
            "A preview link of the song : "+ response.tracks.items[0].external_urls.spotify + "\n" +
            "The album that the song is from : "+response.tracks.items[0].album.name + "\n"
             ) , function(err) {
                if(err) throw err;
            });

        }).catch(function(err){
            console.log(err);
        });
            
        
    
    }
    return;
}    
////////////////////////////////////////////////////
function do_what_it_says(){
    fs.appendFile("log.txt",("\n"+"********  Do What it says  **********"+"\n\n"+""+"\n"+"*********    "+
        Date()+"    ********"+"\n"+"user input : "+inputcatagory+"\n"+ "user input : "+ requiredinfo +"\n" ), function(err) {
        if(err) throw err;
    });
        fs.readFile("random.txt","utf8",function(err , data){
            var randomtxt=data.split(",");
           inputcatagory=randomtxt[0];
           requiredinfo=randomtxt[1];
           console.log("*****************DO-WHAT-IT-SAYS**********************")
            // console.log(randomtxt);
            console.log(randomtxt[0]);
            console.log(randomtxt[1]);
            
            spotify_this_song(requiredinfo);

        });
    // }
}
        
