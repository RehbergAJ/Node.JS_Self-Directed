//Network Access
//Keep an eye on how the data is transferred back and forth
//Access data piece by piece via streams
//Readable and Writable type streams
//http.createServer(function(request,response)) is a read streams
//the response.writeHead is a write streams

//-------------- APPROACH I
// http.createServer(function(request, response) {
//     //above is handler, below is status code (200)
//     response.writeHead(200);
//     //readable event
//     request.on('readable', function() {
//         var chunk = null;
//         while (null !== (chunk = request.read())){
//             //console.log(chunk.toString());
//             response.write(chunk);
            
//         }
//     });
//     request.on('end', function(){
//         response.end();
//     })
// }).listen(8080)

//------------------------ APPROACH II
http.createServer(function(request, response) {    
    response.writeHead(200);
    request.pipe(response);
}).listen(8888)

// curl -d 'hello' http://localhost:8888
//Using streams
var fs = require('fs'); //require filesystem module
//readStream from orig file
var file = fs.createReadStream("readme.md");
//create write stream to copy
var newFile = fs.createWriteStream("readme_copy.md");
//creates stream
file.pipe(newFile);

var fs = require('fs');
var http = require('http');

http.createServer(function(request, resoinse) {
    var newFile = fs.createWriteStream("readme_copy.md");
    request.pipe(newFile);

    request.on('end', function() {
        response.end('uploaded!');
    });
}).listen(8888);

//progress model
http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("readme_copy.md");
    var fileBytes = request.headers['content-length'];
    var uploadedBytes = 0;

    request.on('readable', function() {
        var chunk = null;
        while(null !== (chunk = request.read())){
            uploadedBytes += chunk.length;
    var progress = (uploadedBytes / fileBytes) * 100;
    response.write("progress: " + parseInt(progress, 10) + "%\n");
        }
    })

    request.pipe(newFile);
}).listen(8080);