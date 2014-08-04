// 1. Client is told by the server to draw canvas
// 2. Client sends keystate updates to the server
// 3. Client redraws canvas each and everytime the server updates ball and paddle positions
// 4. Client is told by the server what position they're in(top or bottom)
var constants = {court: {width: 500, height: 500},
    paddle: { width: 100, height: 15, delta: 3 },
    ball: { radius: 10, deltaLeft: 2, deltaTop: 2, interval: 10 } };

var state = { paddles: {},
    ball: { left: constants.court.width / 2, top: constants.court.height / 2 },
    bottomPaddle: 0,
    topPaddle: 0,
    player1Lives: 7,
    player2Lives: 7,
    names: {}
    }

exports.main = function (io, socket, serverState) {
  io.sockets.emit('score',{ 
      loser: 'top', lives: { top: state.player2Lives, bottom: state.player1Lives} 
});

var calculateBallPosition = function() {
    var left = state.ball.left + constants.ball.deltaLeft,
        top = state.ball.top + constants.ball.deltaTop;
       // bottom
            if (top + constants.ball.radius >= constants.court.height - constants.paddle.height) {
                if (state.bottomPaddle){             
                        if (ballHitBottomPaddle(left)){
                        top = constants.court.height - constants.paddle.height - constants.ball.radius;
                                constants.ball.deltaTop = -constants.ball.deltaTop;                     
                                socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                                deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                    } else {
                        console.log('game over bottom');
                        state.player1Lives -= 1;
                        io.sockets.emit('score',{ 
                            loser: 'top', lives: { top: state.player2Lives, bottom: state.player1Lives } 
        });
                        left = constants.court.width / 2;
                        top = constants.court.height / 2;                       
                          socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                                deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                        }
                } else if (top + constants.ball.radius >= constants.court.height) {
                    top = constants.court.height - constants.ball.radius;
                    constants.ball.deltaTop = -constants.ball.deltaTop;
                    socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                        deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                }
        }
        
         // top
        if ( top - constants.ball.radius <= constants.paddle.height ) { 
                if ( state.topPaddle ) {
            if ( ballHitTopPaddle( left ) ) {
                                top = constants.paddle.height + constants.ball.radius ;
                                constants.ball.deltaTop = -constants.ball.deltaTop;                     
                                socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                                deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                        }
                        else {
                                console.log( 'game over top');
        state.player2Lives -= 1;
        io.sockets.emit('score', { 
          loser: 'top', lives: { top: state.player2Lives, bottom: state.player1Lives } 
        });
                                left = constants.court.width / 2;
                                top = constants.court.height / 2;                       
                                socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                                deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                        }
        } else if ( top - constants.ball.radius <= 0 ) {        
                        //WALL
                        top = constants.paddle.height + constants.ball.radius;
                        constants.ball.deltaTop = -constants.ball.deltaTop;     
                        socket.emit('ball', { vector: { x: state.ball.left, y: state.ball.top,
                                                                                                                                                        deltaX: constants.ball.deltaLeft, deltaY: constants.ball.deltaTop }});
                }
        }    
        
  state.ball.left = left;
  state.ball.top = top;
};

// controls what happens when ball hits top paddle - change to right
var ballHitTopPaddle = function( x ){
        if ( x > ( (state.paddles[state.topPaddle]/100) * constants.court.width - constants.paddle.width / 2) ) 
        {
                if (x < ( (state.paddles[state.topPaddle]/100) * constants.court.width + constants.paddle.width / 2) )          
                        return true;            
                else return false;
        } else return false;
}
// controls what happens when ball hits bottom paddle - change to left
var ballHitBottomPaddle = function( x ){
        if (x > ( (state.paddles[state.bottomPaddle]/100) * constants.court.width - constants.paddle.width / 2) ) 
        {
                if (x < ( (state.paddles[state.bottomPaddle]/100) * constants.court.width + constants.paddle.width / 2) )               
                        return true;            
                else return false;
        } else return false;
}


var addPlayer = function( id ) {
        var paddleAdded = false;
        if (!state.bottomPaddle) {
                state.bottomPaddle = id;
        } else if (!state.topPaddle) {
                state.topPaddle = id;
        } else {
          // placeholder for fifth player
          return;
        }
        state.paddles[id] = 50;
}




  addPlayer( socket.id );
  
        socket.emit('environment', { court:  {  width:  constants.court.width, 
                               height: constants.court.height,
                             }, 
                                                                 paddle: {  width: constants.paddle.width, 
                                                                                        height: constants.paddle.height,
                                                                                        delta: constants.paddle.delta
                                                                                 },
                                                                 ball: { radius: constants.ball.radius },
                                                                 player: { id: socket.id, names: state.names }
        });
  
  if ( !serverState.intervalId ) {
      serverState.intervalId = setInterval( function(){
          calculateBallPosition();
      }, constants.ball.interval );  
  }
  
  io.sockets.emit('paddles', { positions: state.paddles, sides: {bottom: state.bottomPaddle, top: state.topPaddle, left: state.leftPaddle, right: state.rightPaddle }});     

  socket.on('paddle', function (data) {
    io.sockets.emit('paddles', { positions: state.paddles, sides: {bottom: state.bottomPaddle, top: state.topPaddle, left: state.leftPaddle, right: state.rightPaddle }});     
    state.paddles[socket.id] = data.left;
  });
  
}

exports.removePlayer = function( io, socket ) {
  if (state.bottomPaddle == socket.id)
      state.bottomPaddle = 0;
  else if (state.topPaddle == socket.id)
      state.topPaddle = 0;
  else return;
  io.sockets.emit('paddles', { positions: state.paddles, sides: {bottom: state.bottomPaddle, top: state.topPaddle, left: state.leftPaddle, right: state.rightPaddle }});     
}