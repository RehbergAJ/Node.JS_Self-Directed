//Import all the dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

    //telling express where to server the static files from
    app.use(express.static(__dirname + '/public'));

    /**#ConnectionString setup the connection string */
    mongoose.connect("mongodb://127.0.0.1:8888/chat");

    /**#Schema creating schema for chat */
    var ChatSchema = mongoose.Schema({
        created : Date,
        content: String,
        username: String,
        room: String
    });

    //create a modal fromt eh chat schema
    var chat = mongoose.model('Chat', ChatSchema);

    //allow the use of CORS - CORS is an HTTP access control that allows access cross domain
    app.all('*', function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token, X-Key');

        if (req.method == 'OPTIONS'){
            res.status(200).end();
        } else {
            next();
        }
    });

    /**#Routes route for the index file  */
    /**#Get */
    app.get('/', function(req,res){
        //send index into the public directory
        res.sendfile('index.html');
    });

    /**#Setup run on first launch to generate some chat history */
    app.post('/setup', function(req,res){
        //Make the chat data array which will contain each object properties, and must match the schema props
        var pastChat = [{
            created: new Date(),
            content: 'Hello',
            username: 'Drew',
            room: 'Node'
        }, {
            created: new Date(),
            content: 'Bonjour',
            username: 'Rehberg',
            room: 'PHP'
        }, {
            created: new Date(),
            content: 'Chello',
            username: 'Drewsive',
            room: 'css'
        }, {
            created: new Date(),
            content: 'Yo',
            username: 'Berg',
            room: 'JavaScript'        
        }];

        //Loop through each of the pastChats and insert them into the DB
        for (var i = 0; i < pastChat.length; i++){
            //create instance of the model
            var newChat = new Chat(pastChat[i]);
            //save to insert the chat
            newChat.save(function(err, savedChat){
                console.log(savedChat);
            });
        }
        //send a response so the server doesn't lock up
        res.send('created');
    });
    
    