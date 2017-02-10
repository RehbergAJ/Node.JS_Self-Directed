/**
 * Readable stream includes: Readable [boolean], event:'data', event: 'end', event: 'error', event: 'close', pause(), resume(), destroy(), and pipe()
 * WritableStream includes: writable [boolean], event: 'drain', event: 'error', event: 'close', event: 'pipe', write(), end(), destroy(), destroySoon()
 * Readable events can be called by the functions on the WritableStream and vise versa
 * 
 */
//- - - - - READABLE STREAM
var request = require('request');
var s = request('http://www.pluralsight.com/');
var fs = require('fs');
var zlib = require('zlib');
//fs is filesystem

s.on('data', function(chunk){
    console.log(">>>Data>>> " + chunk);
});

s.on('end', function(){
    console.log(">>Done!>>>");
});

//- - - - - - - WRITABLE STREAM
console.log("standardout is writable? " + process.stout.writable);

process.stdout.write("hello");
process.stdout.write("world");

//- - - - - - PIPE
// var request = require('request');
// var s = request('http://www.pluralsight.com/');

// s.pipe(process.stdout);

//SAME AS ABOVE

request('http://www.pluralsight.com/').pipe(process.stdout);
//the create write stream that will download and write the html from the home page
request('http://www.pluralsight.com/').pipe(fs.createWriteStream('pluralsight.html'));
//creates a readable and writable in one line while writing it into a gZipped file 
request('http://www.pluralsight.com/').pipe(zlib.createGzip()).pipe(fs.createWriteStream('pluralsight.html.gz'));

