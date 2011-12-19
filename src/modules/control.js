(function(module) {

  var Control = function() {
    EventEmitter.call(this);
    var that = this;

    this.left = null;
    this.right = null;
    this.jump = null;

    function setKeyRepeat(event, single) {
      if(that[event] === null) {
        if(single) {
          that.emit(event);
          return 1;
        }

        return setInterval(function() {
          that.emit(event);
        }, C.KEY_REPEAT);
      }

      return that[event];
    }

    $('body').keydown(function(event) {
      if(event.keyCode == C.LEFT) {
        that.left = setKeyRepeat('left');
      }

      if(event.keyCode == C.RIGHT) {
        that.right = setKeyRepeat('right');
      }

      if(event.keyCode == C.JUMP) {
        that.jump = setKeyRepeat('jump', true);
      }
    });

    $('body').keyup(function(event) {
      if(event.keyCode == C.LEFT) {
        clearInterval(that.left);
        that.left = null;
      }

      if(event.keyCode == C.RIGHT) {
        clearInterval(that.right);
        that.right = null;
      }

      if(event.keyCode == C.JUMP) {
        clearInterval(that.jump);
        that.jump = null;
      }
    });
  };

  Control.prototype = Object.create(EventEmitter.prototype);

  module.Constructor = Control;

})(app.module('control'));
