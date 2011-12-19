(function(module) {

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
    clear_rect = this.getClearRectangle(x, y);

    this.x += x;
    this.y += y;
    this.emit('clear', clear_rect);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  Char.prototype.jump = function(height) {
    if (this.jumping) {
      return;
    }

    var that = this;
    var up = true;
    var current = 0;

    this.jumping = setInterval(function() {
      if (current >= height) {
        up = false;
      }

      if (up) {
        that.move(0, - 2 * C.UNIT);
        current += 2 * C.UNIT;
      } else {
        that.move(0, 2 * C.UNIT);
        current += - 2 * C.UNIT;
      }

      if (!up && current <= 0) {
        clearInterval(that.jumping);
        that.jumping = false;
      }
    },
    C.KEY_REPEAT);
  };

  module.Constructor = Char;

})(app.module('char'));

