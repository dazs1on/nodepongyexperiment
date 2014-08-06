/* Code had problems loading the index of the site
 * Logged to console to figure stuff out
 * Rewrote entire thing
 */

// 1 - Start server with assigned port as localhost:port
// 2 - Wait for socket for player 1
// 3 - Ask for nickname to use in both chat and the game
// 4 - Player 1 can play by himself until player 2 joins
// 5 - Game automagically resets when lifes get to 0

// Server Constructor
function Server( port )
{
  this.port = process.env.PORT || port;
  this.express = require('express');  
  this.app = this.express.createServer();
} 

// Server methods
Server.prototype = {
    
    // we want the server to use html
    configure: function Server_configure () {
      var server = this;
      this.app.configure(function () {
        server.app.use(server.express.static(__dirname + '/public'));
        server.app.set('views', __dirname);
        
        // disable layout
        server.app.set("view options", {layout: false});
        
        server.app.register('.html', {
          compile: function(str, options){
            return function(locals){
              return str;
            };
          }
        });
      });
    },
    
    // Direct to go to index.html     
    setRoutes: function Server_setRoutes () {
      this.app.get('/', function (req, res) {
        res.render('index.html');
      });
    },
    
    // Set to listen on port
    listen: function Server_listen () {
      var server = this;
      this.app.listen(this.port, function () {
        var addr = server.app.address();
        console.log('Listening on ' + addr.port+ '...');
      });    
    }
}

// Pong Constructor
function PingPong () {
  this.pong = require('./public/client');
  this.sio = require('socket.io');
  this.io = this.sio.listen(server.app, { log: false });
  this.nicknames = {};
  this.state = { intervalId: 0, connections: 0 };
}

// Pong Method
PingPong.prototype = {

  // Start game when 1 websocket is open
  play: function PingPong_play () {
    var context = this;
    this.io.sockets.on('connection', function (socket) {
      
      socket.on('user message', function (msg) {
        socket.broadcast.emit('user message', socket.nickname, msg);
      });

      socket.on('nickname', function (nick, fn) {
        if (context.nicknames[nick]) {
          fn(true);
        } else {
          fn(false);  
          
          //run the main pong method from /public/lib/client.js
          context.pong.main( context.io, socket, context.state );
          
          context.nicknames[nick] = socket.nickname = nick;
          socket.broadcast.emit('announcement', nick + ' connected');
          context.io.sockets.emit('nicknames', context.nicknames);
        }
      });  

      socket.on('disconnect', function () {
        if (!socket.nickname) return;
        delete context.nicknames[socket.nickname];
        
        context.pong.removePlayer( context.io, socket );
        socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
        socket.broadcast.emit('nicknames', context.nicknames);
      });
    });
  }
}

var server = new Server( 8080 );
server.configure();
server.setRoutes();
server.listen(process.env.PORT);

var pingpong = new PingPong();
pingpong.play();

