// Generated by CoffeeScript 1.10.0
(function() {
  var YouAreDaChef, _, exports;

  _ = require('underscore');

  YouAreDaChef = require('YouAreDaChef').YouAreDaChef;

  exports = window || this;

  exports.mixInto = function(arg) {
    var Cell, Square, _for, counter;
    Square = arg.Square, Cell = arg.Cell;
    counter = 1;
    YouAreDaChef.tag('canonicalization').clazz(Square).after({
      initialize: function() {
        return this.value = (counter += 1);
      }
    });
    _for = Square["for"];
    return _.extend(Square, {
      cache: {
        cache_key: function(arg1) {
          var ne, nw, se, sw;
          nw = arg1.nw, ne = arg1.ne, se = arg1.se, sw = arg1.sw;
          return nw.value + "-" + ne.value + "-" + se.value + "-" + sw.value;
        },
        buckets: [],
        clear: function() {
          return this.buckets = [];
        },
        length: 0,
        size: function() {
          return _.reduce(this.buckets, (function(acc, bucket) {
            return acc + _.keys(bucket).length;
          }), 0);
        },
        find: function(square) {
          var base, name, ne, nw, se, sw;
          nw = square.nw, ne = square.ne, se = square.se, sw = square.sw;
          if ((nw != null ? nw.level : void 0) == null) {
            console.trace();
          }
          return ((base = this.buckets)[name = nw.level + 1] || (base[name] = {}))[this.cache_key(square)];
        },
        add: function(square) {
          var base, name, ne, nw, se, sw;
          this.length += 1;
          nw = square.nw, ne = square.ne, se = square.se, sw = square.sw;
          return ((base = this.buckets)[name = nw.level + 1] || (base[name] = {}))[this.cache_key(square)] = square;
        }
      },
      "for": function(quadrants, creator) {
        var found, ne, nw, se, sw;
        found = Square.cache.find(quadrants);
        if (found) {
          return found;
        } else {
          nw = quadrants.nw, ne = quadrants.ne, se = quadrants.se, sw = quadrants.sw;
          return Square.cache.add(_for(quadrants, creator));
        }
      }
    });
  };

  exports;

}).call(this);
