/**
 * Persisting Data
 */

//--app.js
io.sockets.on('connection', function(client) {
    client.on('join', function(name){
        client.set('nickname', name);
        client.broadcast.emit("chat", name + " joined the chat");
    });
    client.on("messages", function(message){
        client.get("nickname", function(error, name){
            client.broadcast.emit("messages", name + ": " + message);
            client.emit("messages", name + ": " + message);
        });
    });
});

// to store the messages
var messages = []; /* store message in array*/
var storeMessage = function(name, data){
    messages.push({name: name, data: data}); /* add message to end of array */
    if (messages.length > 10){
        messages.shift(); /*if more than 10 messages long, remove the first one */
    }
}

io.sockets.on('connection', function(client) {    
    client.on("messages", function(message){
        client.get("nickname", function(error, name){
            client.broadcast.emit("messages", name + ": " + message);
            client.emit("messages", name + ": " + message);
        storeMessage(name, message); /**when client sends a message call storeMessage */
        });
    });
});

/**
 * Node.JS works with MongoDB, CouchDB, PostgreSQL,
 * Memcached, Riak, redis (which is key-value store)
 * All of these are non-blocking databases
 * redis is recommened
 * to use to node_redis library go to GitHub under mranney / node_redis
 * can also npm install redis --save
 */

var redis = require('redis');
var client = redis.createClient();

//to database setting keys and values
client.set("message1", "hello, yes this is dog");
client.set("message2", "hello, no this is spider");
//get from DB
client.get("message1", function(err,reply){
    console.log(reply);
});

//storing list
var message = "hello, this is dog";
client.lpush("messages", message, function(err, reply){
console.log(reply); /** returns length of 1 */
});
var message = "Hello, no this is spider";
client.lpush("messages", message, function(err, reply){
    console.log(reply);/** returns length of 2 */
});
var message = "Hello, this is cat";
client.lpush("messages", message, function(err, reply){
client.ltrim("messages", 0, 1); /**trim keeps first 2 strings and removes the rest */
});
var message = "Hello, no this is duck";
client.lrange("messages", 0, -1, function(err, messages){
    console.log(messages);/** replies with all the strings in the list */
});

/**
 * To add a list of who is logged into the chat service
 * Can do this by using sets, sets are lists of unique data
 * To do this in redis:
 * client.sadd("names", "Dog");
 * client.sadd("names", "Spider");
 * client.sadd("names", "Cat");
 * 
 * to remove:
 * client.srem("names", "Spider");
 * 
 * to reply all members of a set:
 * client.smembers("names", function(err, names){
 * console.log(names);
 * });
 * 
 * 
 */


