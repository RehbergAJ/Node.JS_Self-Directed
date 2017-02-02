
//var redis = require('redis');
//var client = redis.createClient();

client.on('join', function(name){
    //notify other clients of chat joiner
    client.broadcast.emit("add chatter", name);
    /**redisClient.smembers('names', function(err, names){
     * names.forEach(function(name){
     * client.emit('add chatter', name);
     * });
    }); //emit all the currently logged in chatters to the newly connected client

    //redisClient.sadd("chatters", names);
    */
});

client.on('disconnect', function(name){
    client.get('nickname', function(err, name){
        client.broadcast.emit("remove chatter", name);

        //redisClient.srem("chatters", namer);
    });
});

//to database setting keys and values
client.set("message1", "hello, yes this is dog");
client.set("message2", "hello, no this is spider");
//get from DB
client.get("message1", function(err,reply){
    console.log(reply);
});

/**
 * To rewrite to use redis
 * var redisClient = redis.createClient();
 * 
 * var storeMessage = function(name, data){
 *   var message = JSON.stringify({name: name, data: data});
 *  //turns above into string to store into redis
 *  redisClient.lpush("messages", message, function(err, response){
 *    redisClient.ltrim("messages", 0, 9);
 * });
 * }
 * 
 * change join to use redis
 * client.on('join', function(name){
 *  redisClient.lrange("messages", 0, -1, function(err, messages){
 *    messages = messages.reverse() 
 * //reverse so they are emitted in the correct order
 *    messages.forEach(function(message){
 *      //parse into JSON object
 *       message = JSON.parse(message); 
 *       client.emit("messages", message.name + ": " + message.data);
 *    });
 *   });
 * });
 */

var messages = []; /* store message in array*/
var storeMessage = function(name, data){
    messages.push({name: name, data: data}); /* add message to end of array */
    if (messages.length > 10){
        messages.shift(); /*if more than 10 messages long, remove the first one */
    }
}

io.sockets.on('connection', function(client) {
    client.on('join', function(name){
        client.set('nickname', name);
    messages.forEach(function(message){
        client.emit("messages", message.name + ": " + message.data);
    }); /** iterate through message array and emit message on the connecting client for each one */
        client.broadcast.emit("chat", name + " joined the chat");
    });
    client.on("messages", function(message){
        client.get("nickname", function(error, name){
            client.broadcast.emit("messages", name + ": " + message);
            client.emit("messages", name + ": " + message);
            storeMessage(name, message); /**when client sends a message call storeMessage */
        });
    });
});