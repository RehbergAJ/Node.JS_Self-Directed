/** Socket IO
 *  CHat Application in browser
 *  have to use modules or sockets
 *  to install npm install --save socket.io
 * 
 * 
 */

var express = require('express');
var app = express();
//dispatch requests to express
var server = require('http').createServer(app);
//uses server to listen to requests
var io = require('socket.io')(server);
//when client connects it will console.log, listens to requests
io.on('connection', function(client){
    console.log('Client connected...');
});
app.get('/', function(req,res){
    res.sendFile(__dirname + 'index.html');
});
server.listen(8080);


/** index.html
 * this allows for the socket to be run in the browser
 * <script src="/socket.io/socket.io.js"></script>
 * <script>
 *   var socket = io.connect('http://localhost:8080');
 * </script>
 */
//------- apps.js
io.on('connection', function(client){
    console.log('client connected...');
    //emit the messages event ont the client
    //send object hello world
    client.emit('messages', {hello: 'world'});
    
});

//-------- index.html
// <script src="/socket.io/socket.io.js"></script>
// <script>
//     var socket = io.connect('http://localhost:8080');
//     socket.on('messages', function (data){
//      alert(data.hello);
//     });
// </script>

//------------ app.js
//browser listening to messages event
// server listening for messages event which is the client.on
io.on('connection', function(clients){
    client.on('messages', function(data){
        consolelog(data);
    });
});

// //------- JS on index.html to listen to messages event
// <script>
//   
//   var socket = io.connect('http://localhost:8080');
//  grab value and set to message value
//   $('#chat_form').submit(function(e)){
//    send message via emit to server
//       var message = $('#chat_input').val());
//       socket.emit('messages', message);
//   }

//-------app.js
//this allows the users to be able to write back and forth
//the broadcast allows all the users to see the messages
io.on('connection', function(clients){
    client.on('messages', function(data){
        socket.broadcast.emit("messages", data);
    });
});

//----- index.html
/**
 * <script>
 *  insert message onto the screen
 * uses jQuery to set text on screen
 *  socket.on('messages', function(data){ insertMessage(data) });
 * </script>
 */
//----- app.js
io.on('connection', function(client){
    client.on('join', function(name) {
        client.nickname = name; /* set the nickname associated with this client */
    });
});

//-------- index.html
/*
*<script>
*  var server = io.connect('http://localhost:8080');
* server.on('connect', function(data){
    $('#status').htnl('Connected to chattr);
    nickname = prompt("What is your nickname?");

    server.emit('join', nickname); <--- notify the server of the user nickname
});
</script>
*/
//----apps.js
io.on('connection', function(client){
    client.on('join', function(name) {
        client.nickname = name; 
    });
    client.on('messages', function(data){
        var nickname = client.nickname;
    client.broadcast.emit("message", nickname + ": " + message); /*broadcast with the name and message */
    client.emit("messages", nickname + ": " + message); /* send the same message bak to our client */
    });
});