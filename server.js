/* Code had problems loading the index of the site
 * Logged to console to figure stuff out
 * Rewrote entire thing
 */

var express = require('express');
var pong = express();
var server = require('http').createServer(pong);
var io = require('socket.io').listen(server);

var player1 = undefined;
var player2 = undefined;
var socket = undefined;

server.listen(8080);
console.log('Listening on port 8080.....');

pong.use("/", express.static(__dirname + '/public')); //use public directory, i believe this is unix-like(lol)

io.sockets.on('connection', function (socket) {
  console.log('User connected');
    socket.on('disconnect', function(){
        console.log('User disconnected');
        });
    
  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
  });
});