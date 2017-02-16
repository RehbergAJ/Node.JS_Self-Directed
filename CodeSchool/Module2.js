/*
MODULE TWO
DOM triggers events like click, submit and hover
run JQuery to listen to events via DOM
Objects in Node emit events
EventEmitter ==> request
fs.readStream eventEmitter

call back function: function(request, response)

var server = http.createServer();
server.on('request', function(request, response){});


var server = http.createServer();
server.on('request', function(request, response){
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
});




*/

var EventEmitter = require('events').EventEmitter;
var logger = new EventEmiiter();
logger.on('error', function(message){
    console.log('ERR: ' + message);
          
  });
logger.emit('error', 'Spilled Milk');
logger.emit('error', 'Eggs Cracked');

var server = http.createServer();
server.on('request', function(request, response){});

server.on('close', function(){ });