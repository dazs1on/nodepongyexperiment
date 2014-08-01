
/*
 *didnt i already write this?
 */
var Connection = (function() {

    var SERVER_ADDR = 'localhost',
        PORT = 8080,
        
        socket,

        // Defines which player ('p1', 'p2'). Stores the html element ID
        playerElm,

        // player buttons to bind click event
        playerButtons,
        // loop index
        i = 0,

        /*
         * Function that send messages to the server
         * param message: data to send to server
         */
        msg = function (message) {
              socket.send(message);
        },

        onConnectCallback = function() {
            playerElm.childNodes[0].textContent = element + ' connected';
        },

        onMessageCallback = function(data) {
                
            if (data == 'start'){
                h3.textContent = "Winner!";
                init();

            }else {
                // create users 
                if (playerElm == 'p1'){
                    canvas.player2 = data.p2;
                }else{
                    canvas.player1 = data.p1;
                }
            }
        },

        onDisconnectCallback = function() {
              // notify disconnect
                playerElm.childNodes[0].textContent = element + ' disconnected'; 
        },

       // 
        connect = function(event) {
            
            playerElm = this.parentElement;

            // unbind the other button to not let the user create another player
            if(playerElm.id === 'p1') {
                playerButtons[1].removeEventListener('click');
            } else {
                playerButtons[0].removeEventListener('click');
            }
            // socketio needs another server function to work so might as well add that
            socket = new io.Socket(SERVER_ADDR, { port: PORT });
            socket.connect();
            
            socket.on('connect', onConnectCallback);
            socket.on('message', onMessageCallback);
            socket.on('disconnect', onDisconnectCallback);
            
            event.preventDefault();
            event.stopPropagation();
        };


        // constructor
        (function() {
            
            playerButtons = document.querySelectorAll("#p1 a, #p2 a");

            for( ; i < playerButtons.length; i++) {
                playerButtons[i].addEventListener('click', connect, false);
            }
        })();

    return {
        connect: function(elm) {
            return connect(elm);
        },

        socket: socket
    }
});