
/* draw a canvas with browser
 *
 */
var Canvas = (function() {

        // Canvas Element Object
    var canvasObj,
        // Canvas Context
        canvasCtx,
        // Canvas Dimensions
        WIDTH,
        HEIGHT,
        // Limits of mouse moviments
        canvasMinX,
        canvasMaxX,
        canvasMinY,
        canvasMaxY,

        // left pad
        player1 = {
            x : 0,
            y : 0
        },
        // right pad
        player2 = {
            x : 0,
            y : 0
        },

        // ball object
        ball = {
            // starting position
            x  : 0,
            y  : 0,

        // Displacement
            dx : -8,
            dy : 16,
        },

        // Paddle size
        paddle_h = 40,
        paddle_w = 3,

        // redraw canvas each time
        clear = function() {
            canvasObj.setAttribute('height', 250);
        },

       // creating the circle
        circle = function(x, y, r) {
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, r, 0, Math.PI*2, true);
            canvasCtx.closePath();
            canvasCtx.fill();
        },

        /*
         * Rectangle creation function
         *
         * param x, y : left upper corner coordinates of the rectangle 
         * param w : Define rectangle width
         * param h : Define rectangle heigh
         * return : drawed rectangle on canvas
         */
        rect = function(x, y, w, h) {
            canvasCtx.beginPath();
            canvasCtx.rect(x,y,w,h);
            canvasCtx.closePath();
            canvasCtx.fill();
        },

        /*
         * Draw entire game on canvas. For each interval execution
         * clean the canvas and redraw objects with its current positions
         * 
         * Controls the collisions of the ball inside the canvas based in 
         * the abscissas and ordinates 
         */
        draw = function() {
            // clean the canvas
            clear();
            // create the ball
            circle(ball.x, ball.y, 5);
            
            //creates the paddles
            rect(player1.x, player1.y, paddle_w, paddle_h);
            rect(player2.x, player2.y, paddle_w, paddle_h);
            
            // Inverts the ball displacement if the ball dimensions 
            // is greater than the canvas vertical limits
            if (ball.y + ball.dy > HEIGHT || ball.y + ball.dy < 0){
                ball.dy = -ball.dy;
            }
                
            // If the ball is going to pass the game area 
            if (ball.x + ball.dx + paddle_w + 5 > WIDTH) {
                
                // Inverts the ball displacement on abscissas
                // if the ball collided with the paddle
                if (ball.y > player1.y && ball.y < player1.y + paddle_h) {
                    ballcanvasObj= -ball.dx;
                
                } else {
                    // End of the game
                    setTimeout(fimJogo,1000);
                }
            
            // If the next moviment of the ball is smaller than the paddle
            }else if (ball.x + ball.dx < paddle_w + 5){

                // Inverts the ball displacement if it collided with the paddle
                if (ball.y > player2.y && ball.y < player2.y + paddle_h) {
                    ball.dx = -ball.dx;
                } else {
                    // End of the game
                    setTimeout(fimJogo,1000);
                }
            }
            
            // move the ball
            ball.x += ball.dx;
            ball.y += ball.dy;
        };

        // document is undefined
        (function() {
            canvasObj = document.getElementById('canvas');
            // Get the canvas element 2D context 
            canvasCtx = canvasObj.getContext("2d");
        })();

    // public methods
    return {
        canvas: canvasObj,
        ctx: canvasCtx,
        player1: player1,
        player2: player2,
        ball: ball,

        draw: function() {
            return draw();
        },
        
    }
});