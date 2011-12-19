(function(module) {

  var Level = function(bg) {
    this.bg = bg.getContext('2d');
  };

  Level.prototype.buildLevel = function(data) {
    this.buffer = document.createElement('canvas');
    this.buffer.width = data.w;
    this.buffer.height = data.h;

    var i = 0;
    var ctx = this.buffer.getContext('2d');

    var image = document.getElementById(data.background);
    ctx.drawImage(image, 0, 0);

    for (i = 0; i < data.elements.length; i++) {
      var elem = data.elements[i];
      ctx.fillStyle = elem.color;
      ctx.fillRect(elem.x, elem.y, elem.w, elem.h);
    }

    // DEBUG BLOCK //
    this.buffer.id = 'debug';
    $('body').append(this.buffer);
    // END DEBUG //
  };

  Level.prototype.load = function(level_path, callback) {
    var that = this;

    $.getJSON(level_path, function(data) {
      that.name = data.name;
      that.elements = data.elements;
      that.start = data.start;

      that.buildLevel(data);
      callback();
    });
  };

  Level.prototype.checkInside = function(x, y) {
    if (x < 0 || x > C.APP_WIDTH || y < 0 || y > C.APP_HEIGHT) {
      return false;
    }

    return true;
  };

  Level.prototype.isContainedWithin = function(corners, elem) {
    var i = null;
    var e = elem;

    for (i in corners) {
      if (corners.hasOwnProperty(i)) {
        var c = corners[i];
        if (c[0] > (e.x - this.bg_x) && c[0] < (e.x + e.w - this.bg_x)) {
          if(c[1] > (e.y - this.bg_y) && c[1] < (e.y + e.h - this.bg_y)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  Level.prototype.collision = function(x, y) {
    var i = 0;
    var corners = {
      tl: [x, y],
      tr: [x + C.CHAR_WIDTH, y],
      bl: [x, y + C.CHAR_HEIGHT],
      br: [x + C.CHAR_WIDTH, y + C.CHAR_HEIGHT]
    };

    for (i = 0; i < this.elements.length; i++) {
      if (this.isContainedWithin(corners, this.elements[i])) {
        return true;
      }
    }

    return false;
  };

  Level.prototype.setBackground = function(x, y) {
    this.bg_x = x;
    this.bg_y = y;
    this.bg.drawImage(this.buffer, x, y, C.APP_WIDTH, C.APP_HEIGHT, 0, 0, C.APP_WIDTH, C.APP_HEIGHT);
  };

  Level.prototype.moveScreen = function(cur_x, move_x, cur_y, move_y) {
    var to_move = false;

    if(move_x > 0 && cur_x + move_x > 0.8 * C.APP_WIDTH) {
      to_move = true;
    } else if(move_x < 0 && cur_x + move_x < 0.2 * C.APP_WIDTH) {
      to_move = true;
    }

    if(to_move) {
      this.setBackground(this.bg_x + move_x, this.bg_y + move_y);
    }

    return to_move;
  };

  Level.prototype.endOfReel = function(x) {

  };

  module.Constructor = Level;

})(app.module('level'));

