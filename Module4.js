var http = require('http'); //http library
var fs = require('fs'); //fs library

var hello = function() {
    console.log("hello!");
}
module.exports = hello;

//this would be called from a second file, which would be calling the class and method above. Herein referred to as
// custom_hello
//------------------------Start of app.js
var hello = require('./custom_hello');
var gb = require('./custom_goodbye');

hello();
gb.goodbye();

//doing it in one line
require("./custom_goodbye").goodbye();
//------------------End app.js

//custom_goodbye.js
//sets it as a public method
exports.goodbye = function() {
    console.log("bye!");
}

//-------------------------------------my_module.js
//private, only available within the module
var foo = function() {...}
var bar = function() {...}
var baz = function() {...}

//public
exports.foo = foo
exports.bar = bar

//-----------------------------------app.js
var myMod = require('./my_modeule');
myMod.foo();
myMod.bar();


//-------------- app.js
var http = require('http'); //pulls module
//modularizing it into a function
var makeRequest = function(message) {
    var message = "Here's looking at you, kid.";
    var options = {
        host: 'localhost', port: 8080, path: '/', method: 'POST'
    }
    //initialize request
    var request = http.request(options, function(response){
        //callback method
        response.on('data', function(data){
            console.log(data);//logs response body
        });
    });
    request.write(message); //begins request
    request.end();
}
//invoke it
makeRequest("Here's looking at you, kid.");

//now to encapsilate it into a module
//----------------make_request.js
var http = require('http');

var makeRequest = function(message) {


}
module.exports = makeRequest;
//-------------------end make request
//------------------APP
var makeRequest = require('./make_request');
makeRequest("Here's looking at you, kid");
makeRequest("Hello, this is dog");

//where does require look for module
//./ looks in the same directory
//../ looks up same directory
// /users/berg/nodes/make_request then it looks in the absolute path privided
// not specifiying a path makes it look in the home directory and then root. Basically keeps looking each time going up a folder
//find packages in NPM, module repository is there. Dependency Management, and can publish modules there.
//npmjs.org
//npm install request
// to install a module globally simply add a -g on the end to do so
// can't require a module if they are installed globally. They will still need to be installed locally like so:
// $ npm install coffe-script then
var coffee = require('coffee-script');

//create my_app/package.json to define your module, so you can define your Dependency(ies) plus the version number. If you do not 
// have all of the dependencies then use npm install

