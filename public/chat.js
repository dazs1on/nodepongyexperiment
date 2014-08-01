// chat namespace
(function () {
  window.Chat = {
    socket : null,
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      // use custom button and send message
      $('#send').click(function() {
        Chat.send();
      });

      $('#message').keyup(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

      // keep socket open
      this.socket.on('new', this.add);
    },

    add : function(data) {
      var name = data.name || 'anonymous';
      var msg = $('<div class="msg"></div>')
        .append('<span class="name">' + name + '</span>: ')
        .append('<span class="text">' + data.msg + '</span>');

      $('#messages')
        .append(msg)
        .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    },
 
    send : function() {
      this.socket.emit('msg', {
        name: $('#name').val(),
        msg: $('#message').val()
      });

      $('#message').val('');

      return false;
    }
  };
}());