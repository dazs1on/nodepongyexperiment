// main function is here
var Client = (function(){
    
    var main = function() {

        canvas = Canvas(); //puts the canvas on the table 
        connection = Connection(); //establishes connection
        game = Game(canvas, connection); // combine both 
    };

    return main();

})();