
var redis = require('redis');
var client = redis.createClient();
// To rewrite to use redis
var redisClient = redis.createClient();

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var messages = []; /* store message in array*/
var nickname = client.nickname; //name of member


io.sockets.on('connection', function(client) {
        // changed join to use redis
        //when the client joins
    client.on('join', function(name){
        //add member to chat
        client.broadcast.emit("add member", name);
        //add member name to chat
        redisClient.smembers('names', function(err, names){
            names.forEach(function(name){
                client.emit('add member', name);
            });
        });
        redisClient.sadd("members", name);
    });

        //when the client messages
        redisClient.lrange("messages", 0, -1, function(err, messages){
            //emmit them in the right order
            messages = messages.reverse() 
            //reverse so they are emitted in the correct order
            messages.forEach(function(message){
                //parse into JSON object
                message = JSON.parse(message); 
                //emit to client
                client.emit("messages", message.name + ": " + message.data);
            });
        });    

    //when the client disconnects
    client.on('disconnect', function(name){
        client.get('nickname', function(err, name){
            client.broadcast.emit("remove member", name);
            redisClient.srem("members", name);
        });
    });

    //--------------- using redis to store the messages
    var storeMessage = function(name, data){
        //turns into string the database can store it
        var message = JSON.stringify({name: name, data: data});
        //turns above into string to store into redis
        redisClient.lpush("messages", message, function(err, response){
            //keeps the first 10 strings, then leaves the rest
            redisClient.ltrim("messages", 0, 9);
        });
    };  


});

app.get('/', function (require, response) {
    res.sendFile(__dirname + 'index.html');
});

server.listen(8080);

//to database setting keys and values
//using redis
client.set("message1", "hello, yes this is dog");
client.set("message2", "hello, no this is spider");
//get from DB
client.get("message1", function(err,reply){
    console.log(reply);
});

//add and remove members of the nameset
client.sadd("names", "Doug");
client.sadd("names", "Carl");
client.sadd("names", "Glen");
 
client.srem("names", "Carl");

