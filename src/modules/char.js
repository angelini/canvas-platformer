(function(module) {

  var Char = function(properties, control, level, canvas) {
    EventEmitter.call(this);

    var i = null;
    this.level = level;
    this.control = control;
    this.ctx = canvas.getContext('2d');

    for (i in properties) {
      if (properties.hasOwnProperty(i)) {
        this[i] = properties[i];
      }
    }

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.setControls();
  };

  Char.prototype = Object.create(EventEmitter.prototype);

  Char.prototype.setControls = function() {
    var that = this;

    this.control.on('right', function() {
      that.move(C.UNIT, 0);
    });

    this.control.on('left', function() {
      that.move(-1 * C.UNIT, 0);
    });

    this.control.on('jump', function() {
      that.jump(20 * C.UNIT);
    });
  };

  Char.prototype.clear = function(rect) {
    if(rect) {
       return this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    this.ctx.clearRect(0, 0, C.APP_WIDTH, C.APP_HEIGHT);
  };

  Char.prototype.getClearRectangle = function(x, y) {
    var rect = {};

    if (x > 0) {
      rect.x = this.x;
      rect.width = this.width + x;
    } else {
      rect.x = this.x + x;
      rect.width = this.width - x;
    }

    if (y > 0) {
      rect.y = this.y;
      rect.height = this.height + y;
    } else {
      rect.y = this.y + y;
      rect.height = this.height - y;
    }

    return rect;
  };

  Char.prototype.move = function(x, y) {
    var clear_rect = this.getClearRectangle(x, y);
    if(!this.level.checkInside(this.x + x, this.y + y)) {
      console.log('outside');
      return;
    }

    if(!this.level.collision(this.x + x, this.y)) {
      this.x += x;
    }

    if(!this.level.collision(this.x, this.y + y)) {
      this.y += y;
    }

    this.clear(clear_rect);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    if(!this.level.collision(this.x, this.y + C.UNIT)) {
      this.fall();
    }
  };

  Char.prototype.fall = function() {
    if (this.falling || this.jumping) {
      return;
    }

    var that = this;
    this.falling = true;
    
    setTimeout(function() {
      that.falling = null;
      that.move(0, 1.6 * C.UNIT);
    },
    C.KEY_REPEAT);
  };

  Char.prototype.jump = function(height) {
    if (this.jumping || this.falling) {
      return;
    }

    var that = this;
    var up = true;
    var current = 0;

    this.jumping = setInterval(function() {
      if (current >= height) {
        clearInterval(that.jumping);
        that.jumping = false;
      }

      that.move(0, - 1.6 * C.UNIT);
      current += 1.6 * C.UNIT;
    },
    C.KEY_REPEAT);
  };

  module.Constructor = Char;

})(app.module('char'));

