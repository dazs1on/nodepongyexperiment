// game variable
var Game = (function(canvas){

        var h3,
            // Controls the game start
            started = false,

            // controls setInterval
            intervalId = 0,

            // piecing together the game
            init = function () {
                // Start the game
                if (!started){

                    window.canvasCtx = canvasCtx;
                    // Define the canvas bitmap dimensions 
                    canvas.obj.setAttribute('width', 500);
                    canvas.obj.setAttribute('height', 250);
                    
                    // Assign the canvas object dimensions to the program
                    WIDTH  = canvas.obj.width;   
                    HEIGHT = canvas.obj.height;
                    
                    // Put paddles on the abscissa: 5 px left, -5 px right
                    canvas.player1.x = WIDTH -5;
                    canvas.player2.x = 2;
                    // Put paddles on the ordinate: vertically centralized
                    canvas.player1.y = canvas.player2.y = (HEIGHT /2)-(paddle_h/2);
                    
                    // Define canvas limits horizontally
                    canvasMinX = canvas.obj.offsetLeft;
                    canvasMaxX = canvasMinX + WIDTH;
                    
                    // Initial position of the ball
                    ball.x = WIDTH /2;
                    ball.y = HEIGHT /2;
                    //
                    // Define mouse moviments limits on the screen
                    init_mouse();
                    
                    // Bind mousemove event to the onMouseMove function
                    document.documentElement.onmousemove = onMouseMove;
                    
                    // Create the beforeDraw function interval call
                    intervalId = setInterval(beforeDraw, 100);
                    
                    started = true;
                    return intervalId;
                }
                return false;
            },

            /* Mouse limits moviment function */
            init_mouse = function() {
                
              canvasMinY = canvas.obj.offsetTop;
              canvasMaxY = canvasMinY + HEIGHT;
            },

            /* Paddles control function */
            onMouseMove = function(evt) {

              if (evt.pageY > canvasMinY && (evt.pageY + paddle_h) < canvasMaxY) {
              
                  if (playerElm == 'p1')
                      canvas.player1.y = parseInt(evt.pageY - canvasMinY);
                  else
                      canvas.player2.y = parseInt(evt.pageY - canvasMinY);
              }
            },


            beforeDraw = function() {
                
                if (playerElm == 'p1'){
                    msg( {p1 : canvas.player1} );
                }else{
                    msg( {p2 : canvas.player2} );
                }
                
                draw();
            },

            
            fimJogo = function(){
                
                started = false;
                clearInterval(intervalId);
            };

            // pulls h3
            (function() {
            
                h3 = document.getElementsByTagName("h3")[0];
            })();
});