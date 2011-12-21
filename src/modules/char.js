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
      that.move( - 1 * C.UNIT, 0);
    });

    this.control.on('jump', function() {
      that.jump(20 * C.UNIT);
    });
  };

  Char.prototype.clear = function() {
    this.ctx.clearRect(0, 0, C.APP_WIDTH, C.APP_HEIGHT);
  };

  Char.prototype.move = function(x, y) {
    if (!this.level.checkInside(this.x + x, this.y + y)) {
      return;
    }

    if (!this.level.collision(this.x + x, this.y)) {
      if (!this.level.moveScreen(this.x, x, this.y, 0)) {
        this.x += x;
      }
    }

    if (!this.level.collision(this.x, this.y + y)) {
      this.y += y;
    }

    this.clear();
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    if (!this.level.collision(this.x, this.y + C.UNIT)) {
      this.fall();
    }
  };

  Char.prototype.fall = function() {
    if (this.falling || this.jumping) {
      return;
    }

    var that = this;
    var acc = 0.3;

    this.falling = setInterval(function() {
      if (that.level.collision(that.x, that.y + acc * C.UNIT)) {
        while(!that.level.collision(that.x, that.y + 1)) {
          that.move(0, 1);
        }
        clearInterval(that.falling);
        that.falling = null;
      }

      that.move(0, acc * C.UNIT);
      acc += 0.1;
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
    var acc = 2;

    this.jumping = setInterval(function() {
      if (current >= height) {
        clearInterval(that.jumping);
        that.jumping = false;
      }

      that.move(0, - acc * C.UNIT);
      current += acc * C.UNIT;
      acc -= 0.1;
    },
    C.KEY_REPEAT);
  };

  module.Constructor = Char;

})(app.module('char'));

