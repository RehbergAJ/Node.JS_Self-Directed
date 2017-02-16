/** ============================= DEPENDENCIES ============================== */
//Import all the dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

    //telling express where to server the static files from
    app.use(express.static(__dirname + '/public'));

    /** #CONNECTION setup the connection string */
    mongoose.connect("mongodb://127.0.0.1:2017/chat");

    /** #SCHEMA creating schema for chat */
    var ChatSchema = mongoose.Schema({
        created : Date,
        content: String,
        username: String,
        room: String
    });

    //create a modal from the chat schema
    var chat = mongoose.model('Chat', ChatSchema);

    // #CORS allow the use of CORS - CORS is an HTTP access control that allows access cross domain
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

/** ============================= END DEPENDENCIES ============================== */    

/** ============================== NODE ROUTES ==================================== */
    /** #ROUTES route for the index file  */
    /** #GET */
    app.get('/', function(req,res){
        //send index into the public directory
        res.sendfile('index.html');
    });

    /** #SETUP run on first launch to generate some chat history */
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
    

    /** #GET make a list of chats filtered by room, get them then pass them to the JSON as an array */
    app.get('/msg', function(req, res){
    /** #FIND */
        chat.find({
            'room': req.query.room.toLowerCase()
        }).exec(function(err, msgs){
        /** #SEND */
            res.json(msgs);
        });
    });
/** ===================== END NODE ROUTES ==================================== */

/** ============================ SOCKET ==================================== */

/** #CONNECTION listen for the connection */
    io.on('connection', function(socket){
        //Global vars
        var defaultRoom = 'general', 
            rooms = ["General", "Node", "JavaScript", "CSS", "PHP"]

        //Emit the rooms array
        socket.emit('setup', {
            rooms: rooms
        });

        //listen for new users
        socket.on('new user', function(data){
            data.room = defaultRoom;
            //New user joins the defaultRoom
            socket.join(defaultRoom);
            //Emit the new user joining to the other users
            io.in(defaultRoom).emit('user joined', data);
        });

        //Listen for room switch
        socket.on('switch room', function(data){
            //handles joins and leaves
            socket.leave(data.oldRoom);
            socket.join(data.newRoom);
            io.in(data.oldRoom).emit('user left', data);
            io.in(data.newRoom).emit('user joined', data);
        });

        /** #CHATLISTENER Listens for new chat messages */
        socket.on('new message', function(data){
            /** #CREATEMSG creating a new message */
            var newMsg = new chat({
                userName: data.username,
                content: data.message,
                room: data.room.toLowerCase(),
                created: new Date()
            });
            /** #SAVE save it to the DB */
            newMsg.save(function(err, msg){
                //emit the message to the users in the room
                io.in(msg.room).emit('message created', msg);
            });
        });
    });
/** ============================ END SOCKET ==================================== */
server.listen(2017);
console.log('Listening on port 2017 and beginning chat');