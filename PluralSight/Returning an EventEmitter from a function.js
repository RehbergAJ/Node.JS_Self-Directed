var EventEmitter = require('events').EventEmitter;
var util = require('util');

var getResource = function(c){
    //instantiate new emitter
    var emitter = new EventEmitter();
    //on the very next tick run this
    //return to be called before
    //before next tick emit start, then setInterval
    //keep count of data events
    //check count, when it equals the amount we put in, then stop it
    process.nextTick(function() {
        var count = 0;
        emitter.emit('start');
        var int = setInterval(function (){
            emitter.emit('data', ++count);
            if (count === c) {
                e.emit('end', count);
                clearInterval(int);
            }
        }, 10);
    });
    return(emitter);
};

// function Resource (m){
//     //Resource emits this time
//     var maxEvents = m;
//     var self = this;

//     process.nextTick(function() {
//         var count = 0;
//         self.emit('start');
//         var int = setInterval(function (){
//             self.emit('data', ++count);
//             if (count === maxEvents) {
//                 self.emit('end', count);
//                 clearInterval(int);
//             }
//         }, 10);
//     });
// }


var res = getResource(5);

res.on('start', function() {
    console.log("I've started");
});

res.on('data', function(d){
    console.log("   I received the data -> " + d);
});

util.inherits(Resource, EventEmitter);
module.exports = Resource;