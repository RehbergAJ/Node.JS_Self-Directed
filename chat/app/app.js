//load angular
var app = angular.module('node-chat', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'btford.socket.io']);

//set server url
var serverBaseUrl = 'http://localhost:2017';

//Services to interact with nodeWebKit GUI and the window
app.factory('GUI', function (){
  //Return nw.gui
  return require('nw.gui');
});

app.factory('Window', function(){
  return GUI.Window.get();
});

//Service to interact with the socket library
app.factory('socket', function (socketFactory) {
  var myIoSocket = io.connect(serverBaseUrl);
  var socket = socketFactory({
    ioSocket: myIoSocket
  });
  return socket;
});

//Create Angular service to help get the nodeWebKit GUI object
//ng-enter directive
//Bind keydown event on enter using Angular
app.directive('ngEnter', function(){
  return function (scope, element, attrs){
    element.bind("keyDownPress", function (event){
      if (event.which === 13){
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

//Controller
app.controller('MainCtrl', function ($scope, Window, GUI, $mdDialog, socket, $http){
  //Menu setup will setup menu like a drop down
  //Global scope
  $scope.messages = [];
  $scope.room = "";

  windowMenu.append(new GUI.MenuItem({
    label: 'Rooms',
    submenu: roomsMenu
  }));

  windowMenu.append(new GUI.MenuItem({
    label: 'Exit',
    click: function () {
      Window.close();
    }
  }));

  //Build the window menu using GUI and Window 
  var windowMenu = new GUI.Menu({
    type: 'menubar'
  });
  var roomsmenu = new GUI.Menu();
  
  //listen for setup event then create rooms
  socket.on('setup', function(data) {
    var rooms = data.rooms;

    for (var i = 0; i < rooms.length; i++){
      //loop and append room to window
      handleRoomSubMenu(i);
    }

    //handle room creation
    function handleRoomSubMenu(i) {
      var clickedRoom = rooms[i];
      //append each room to menu
      roomsMenu.append(new GUI.MenuItem({
        label: clickedRoom.toUpperCase(),
        click: function () {
          //on click switch room
          $scope.room = clickedRoom.toUpperCase();
          //notify server of change
          socket.emit('switch room', {
            newRoom: clickedRoom,
            username: $scope.username
          });
          //fetch new room messages
          $http.get(serverBaseUrl + '/msg?room=' + clickedRoom).success(function (msgs){
            $scope.messages = msgs;
          });
        }
      }));    
    //attach menu
    GUI.Window.get().menu = windowMenu;
  }
  //get username using Angular material modal
  $scope.usernameModel = function (ev) {
    //launch modal to get username
    $mdDialog.show({
      controller: UsernameDialogController,
      templateUrl: 'partials/username.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    })
    .then(function (answer) {
      //set username with the value returned from the modal
      $scope.username = answer;
      //tell server about new user
      socket.emit('new user', {
        username: answer
      });
      //set room to general
      $scope.room = 'GENERAL';
      //fetch chat messages in GENERAL
      $http.get(serverBaseUrl + '/msg?room=' + $scope.room).success(function (msgs){
        $scope.messages = msgs;
      });
    }, function () {
      Window.close();
    });
  };
  //listen for new message
  socket.on('message created', function(data){
    //push to new message to $scope.messages
    $scope.messages.push(data);
    //Empty textarea
    $scope.message = "";
  });
  //Send a new message
  $scope.send = function (msg) {
    //Notify the server of the new message
    socket.emit('new message', {
      room: $scope.room,
      message: msg,
      username: $scope.username
    });
  };

  //Dialog Controller
  function UsernameDialogController($scope, $mdDialog){
    $scope.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  }

});

//load express
var express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser');

var routes = require('./routes');

var application = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	// log a message to console!
});

});