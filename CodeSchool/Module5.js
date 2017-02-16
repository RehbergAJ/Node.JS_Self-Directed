var express = require('express');
// to install it: npm install --save express
var app = express();
//'/' is the root route
// end point
app.get('/', function(request, response) {
    //__dirname is the current directory
    response.sendFile(__dirname + "/index.html");
});
app.listen(8080);
//running rucl http://localhost:8080/ will return 200 OK and the show the file in the browser

//--------- app.js
//latest 10 tweets off of twitter
//req and url modules
var request = request('request');
var url = require('url');
//tweet end point
app.get('/tweets/:username', function(req, response) {

    var username = req.params.username;

    options = {
        protocol: "http:", /* get the last 10 tweets for screen_name  */
        host: 'api.twitter.com',
        pathname: '/1/statuses/user_timeline.json',
        query: { screen_name: username, count: 10}
    }
    var twitterUrl = url.format(options);
request(twitterUrl).pipe(response); /* pip the request to response */
});

//start node command and type 'node app.js
// then curl -s http://localhost:8080/tweets/eallam
// npm install prettyjson -g 
//pretty json allows it to be readable
/*
    my_app/package.json
    inside code: "dependencies": {
    "express": "4.9.6",
    "ejs", "1.0.0"   <------ npm install --save ejs
    }  <------- Installs the module and adds to package.json
    /Home/andrew/my_app/views <---- default directory
    ejs stands for embeded javascript
*/

//------------------------- app.js
app.get('/tweets/:username', function(req,response){
    //instead of using pipe, use the call back so we have access to err,res and body
    request(url, function(err, res, body){
        //parse the JSON we get back from the reponse body
        var tweets = JSON.parse(body);
        //define data that goes into template. this allows us to display the tweets
        response.locals = {tweets: tweets, name: username};
        //tells response which template to render
        response.render('tweets.ejs');
    });
});

//------------tweets.ejs this is the template
//tells node app to render that variable inside the html using the <%= name %> 
//<%= gets value returned from the expression printed out onto the page
//<% just to run code, won't print out, but will print a list item
<h1>Tweets for @<%= name %></h1>
<ul>
    <% tweets.forEach(function(tweet){ %>
        <li><%= tweet.text %></li>
    <% }); %>
</ul>
// END tweets.ejs