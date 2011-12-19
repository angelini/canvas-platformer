var C = {
  APP_HEIGHT: 400,
  APP_WIDTH: 400,
  CHAR_HEIGHT: 20,
  CHAR_WIDTH: 20,
  UNIT: 5,
  LEFT: 65,
  RIGHT: 68,
  JUMP: 32,
  KEY_REPEAT: 15
};

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

var Char = function(properties, canvas) {
  EventEmitter.call(this);

  var i = null;
  this.ctx = canvas.getContext('2d');

  for (i in properties) {
    if (properties.hasOwnProperty(i)) {
      this[i] = properties[i];
    }
  }

  this.ctx.fillStyle = this.color;
  this.ctx.fillRect(this.x, this.y, this.width, this.height);
};

Char.prototype = Object.create(EventEmitter.prototype);

Char.prototype.getClearRectangle = function(x, y) {
  var rect = {};
  /*
    x: this.x,
    y: this.y,
    width: this.width + x,
    height: this.height + y
  };
  */

  if(x > 0) {
    rect.x = this.x;
    rect.width = this.width + x;
  } else {
    rect.x = this.x + x;
    rect.width = this.width - x;
  }

  if(y > 0) {
    rect.y = this.y;
    rect.height = this.height + y;
  } else {
    rect.y = this.y + y;
    rect.height = this.height - y;
  }

  return rect;
}

Char.prototype.move = function(x, y) {
  clear_rect = this.getClearRectangle(x, y);

  this.x += x;
  this.y += y;
  this.emit('clear', clear_rect);
  this.ctx.fillRect(this.x, this.y, this.width, this.height);
};

Char.prototype.jump = function(height) {
  if(this.jumping) {
    return;
  }

  var that = this;
  var up = true;
  var current = 0;

  this.jumping = setInterval(function() {
    if(current >= height) {
      up = false;
    }
    
    if(up) {
      that.move(0, -2 * C.UNIT);
      current += 2 * C.UNIT;
    } else {
      that.move(0, 2 * C.UNIT);
      current += -2 * C.UNIT;
    }

    if(!up && current <= 0) {
      clearInterval(that.jumping);
      that.jumping = false;
    }
  }, C.KEY_REPEAT);
};



var app = {
  ctx: null,

  paintBg: function(rect) {
    if(rect) {
      return this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    this.ctx.clearRect(0, 0, C.APP_WIDTH, C.APP_HEIGHT);
  },

  init: function() {
    var that = this;
    var canvas = document.getElementById('main');

    canvas.height = C.APP_HEIGHT;
    canvas.width = C.APP_WIDTH;

    this.ctx = canvas.getContext('2d');

    var char = new Char({
      height: C.CHAR_HEIGHT,
      width: C.CHAR_WIDTH,
      x: 0,
      y: C.APP_HEIGHT - C.CHAR_HEIGHT,
      color: 'red'
    },
    canvas);

    char.on('clear', function(rect) {
      that.paintBg(rect);
    });

    var control = new Control();

    control.on('right', function() {
      char.move(C.UNIT, 0);
    });

    control.on('left', function() {
      char.move(-1 * C.UNIT, 0);
    });

    control.on('jump', function() {
      char.jump(20 * C.UNIT);
    });
  }
};

jQuery(function($) {
  app.init();
});

