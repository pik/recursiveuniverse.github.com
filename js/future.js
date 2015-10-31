# This module is part of [recursiveuniver.se](http://recursiveuniver.se).
#
# ## Future Module
#
# The Future Module provides methods for computing the future of a pattern, taking into account its ability to grow beyond
# the size of its container square.

# ### The Life "Universe"
#
# This module mixes special case functionality for computing the `future` of a square into `Square` and `Cell`.

# ### Baseline Setup
_ = require('underscore')
exports = window or this

# ### Setting the rules for this game's "Universe"
#
# There many possible games consisting of cellular automata arranged in a two-dimensional
# matrix. Cafe au Life handles the "[life-like][ll]" ones, roughly those that have:
#
# [ll]: http://www.conwaylife.com/wiki/Cellular_automaton#Well-known_Life-like_cellular_automata
#
# * A stable 'quiescent' state. A universe full of empty cells will stay empty.
# * Rules based only on the population of a cell's Moore Neighborhood: Every cell is affected by the population of its eight neighbours,
#   and all eight neighbours are treated identically.
# * Two states.
#
# Given a definition of the state machine for each cell, Cafe au Life performs all the necessary initialization to compute
# the future of a pattern.
#
# The default, `set_universe_rules()`, is equivalent to `set_universe_rules([2,3],[3])`, which
# invokes Conway's Game of Life, commonly written as 23/3. Other games can be invoked with their survival
# and birth counts, e.g. `set_universe_rules([1,3,5,7], [1,3,5,7])` invokes [Replicator][replicator]
#
# [replicator]: http://www.conwaylife.com/wiki/Replicator_(CA)

# First, here's a handy function for turning any array or object into a dictionary function.
#
# (see also: [Reusable Abstractions in CoffeeScript][reuse])
#
# [reuse]: https://github.com/raganwald/homoiconic/blob/master/2012/01/reuseable-abstractions.md#readme


function dfunc(dictionary) {
  return function(indices=[]) {
    indices.reduce(function(a,i) {
      return a[i]
    }, dictionary)
  }
}

class SquareSmallest extends Square {
}

class Square.Seed extends Square {
   succesor(cells, row, col) {
    current_state = cells[row][col]
    neighbour_count =
      cells[row-1][col-1] +
      cells[row-1][col] +
      cells[row-1][col+1] +
      cells[row][col-1] +
      cells[row][col+1] +
      cells[row+1][col-1] +
      cells[row+1][col] +
      cells[row+1][col+1]
    return rule(current_state, neighbour_count)
   }

  result: ->
    a = [
      [@nw.nw.value, @nw.ne.value, @ne.nw.value, @ne.ne.value]
      [@nw.sw.value, @nw.se.value, @ne.sw.value, @ne.se.value]
      [@sw.nw.value, @sw.ne.value, @se.nw.value, @se.ne.value]
      [@sw.sw.value, @sw.se.value, @se.sw.value, @se.se.value]
    ]
    Square.for
      nw: Square.Seed.succ(a, 1,1)
      ne: Square.Seed.succ(a, 1,2)
      se: Square.Seed.succ(a, 2,2)
      sw: Square.Seed.succ(a, 2,1)
}
function life {
  life.set_universe_rules = function (survival = [2,3], birth = [3])
  rule = dfunc([
    (for (x of _.range(0,9)) birth.indexOf(x) !== -1 ? Cell.Alive : Cell.Dead)
    (for (x of _.range(0,9)) survival.indexOf(x) !== -1 ? Cell.Alive : Cell.Dead)
  ])
  const { Cell, Square } = life;

}
  exports.mixInto = function(life) {
    var Cell, Square, _for, rule;
    rule = function(current_state, neighbour_count) {
      throw 'call set_universe_rules(...) first';
    };
    life.set_universe_rules = function(survival = [2,3], birth = [3])) {
      var x;
      rule = dfunc([
        (for (x of _.range(0,9)) birth.indexOf(x) !== -1 ? Cell.Alive : Cell.Dead),
        (for (x of _.range(0,9)) survival.indexOf(x) !== -1 ? Cell.Alive : Cell.Dead)
      ]);
      return life;
    };
    Cell = life.Cell, Square = life.Square;
    Square.Smallest = (function(superClass) {
      extend(Smallest, superClass);

      function Smallest() {
        return Smallest.__super__.constructor.apply(this, arguments);
      }

      return Smallest;

    })(Square);
    Square.Seed = (function(superClass) {
      extend(Seed, superClass);

      function Seed() {
        return Seed.__super__.constructor.apply(this, arguments);
      }

      Seed.succ = function(cells, row, col) {
        var current_state, neighbour_count;
        current_state = cells[row][col];
        neighbour_count = cells[row - 1][col - 1] + cells[row - 1][col] + cells[row - 1][col + 1] + cells[row][col - 1] + cells[row][col + 1] + cells[row + 1][col - 1] + cells[row + 1][col] + cells[row + 1][col + 1];
        return rule(current_state, neighbour_count);
      };

      Seed.prototype.result = function() {
        var a;
        a = [[this.nw.nw.value, this.nw.ne.value, this.ne.nw.value, this.ne.ne.value], [this.nw.sw.value, this.nw.se.value, this.ne.sw.value, this.ne.se.value], [this.sw.nw.value, this.sw.ne.value, this.se.nw.value, this.se.ne.value], [this.sw.sw.value, this.sw.se.value, this.se.sw.value, this.se.se.value]];
        return Square["for"]({
          nw: Square.Seed.succ(a, 1, 1),
          ne: Square.Seed.succ(a, 1, 2),
          se: Square.Seed.succ(a, 2, 2),
          sw: Square.Seed.succ(a, 2, 1)
        });
      };

      return Seed;

    })(Square);
    Square.RecursivelyComputable = (function(superClass) {
      extend(RecursivelyComputable, superClass);

      function RecursivelyComputable() {
        return RecursivelyComputable.__super__.constructor.apply(this, arguments);
      }

      RecursivelyComputable.square_to_intermediate_map = function(square) {
        return {
          nw: square.nw,
          ne: square.ne,
          se: square.se,
          sw: square.sw,
          nn: {
            nw: square.nw.ne,
            ne: square.ne.nw,
            se: square.ne.sw,
            sw: square.nw.se
          },
          ee: {
            nw: square.ne.sw,
            ne: square.ne.se,
            se: square.se.ne,
            sw: square.se.nw
          },
          ss: {
            nw: square.sw.ne,
            ne: square.se.nw,
            se: square.se.sw,
            sw: square.sw.se
          },
          ww: {
            nw: square.nw.sw,
            ne: square.nw.se,
            se: square.sw.ne,
            sw: square.sw.nw
          },
          cc: {
            nw: square.nw.se,
            ne: square.ne.sw,
            se: square.se.nw,
            sw: square.sw.ne
          }
        };
      };

      RecursivelyComputable.map_fn = function(fn) {
        return function(parameter_hash) {
          return _.reduce(parameter_hash, function(acc, value, key) {
            acc[key] = fn(value);
            return acc;
          }, {});
        };
      };

      RecursivelyComputable.take_the_canonicalized_values = RecursivelyComputable.map_fn(function(quadrants) {
        return Square["for"](quadrants);
      });

      RecursivelyComputable.take_the_results = RecursivelyComputable.map_fn(function(square) {
        return square.result();
      });

      RecursivelyComputable.take_the_results_at_time = function(t) {
        return this.map_fn(function(square) {
          return square.result_at_time(t);
        });
      };

      RecursivelyComputable.intermediate_to_subsquares_map = function(intermediate_square) {
        return {
          nw: {
            nw: intermediate_square.nw,
            ne: intermediate_square.nn,
            se: intermediate_square.cc,
            sw: intermediate_square.ww
          },
          ne: {
            nw: intermediate_square.nn,
            ne: intermediate_square.ne,
            se: intermediate_square.ee,
            sw: intermediate_square.cc
          },
          se: {
            nw: intermediate_square.cc,
            ne: intermediate_square.ee,
            se: intermediate_square.se,
            sw: intermediate_square.ss
          },
          sw: {
            nw: intermediate_square.ww,
            ne: intermediate_square.cc,
            se: intermediate_square.ss,
            sw: intermediate_square.sw
          }
        };
      };

      RecursivelyComputable.sequence = function() {
        var fns;
        fns = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return _.compose.apply(_, fns.reverse());
      };

      RecursivelyComputable.prototype.result = function() {
        return Square["for"](Square.RecursivelyComputable.sequence(Square.RecursivelyComputable.square_to_intermediate_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results, Square.RecursivelyComputable.intermediate_to_subsquares_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results)(this));
      };

      RecursivelyComputable.prototype.result_at_time = function(t) {
        if (t === 0) {
          return Square["for"]({
            nw: this.nw.se,
            ne: this.ne.sw,
            se: this.se.nw,
            sw: this.sw.ne
          });
        } else if (t <= Math.pow(2, this.level - 3)) {
          return Square["for"](Square.RecursivelyComputable.sequence(Square.RecursivelyComputable.square_to_intermediate_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results_at_time(t), Square.RecursivelyComputable.intermediate_to_subsquares_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results_at_time(0))(this));
        } else if ((Math.pow(2, this.level - 3) < t && t < Math.pow(2, this.level - 2))) {
          return Square["for"](Square.RecursivelyComputable.sequence(Square.RecursivelyComputable.square_to_intermediate_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results, Square.RecursivelyComputable.intermediate_to_subsquares_map, Square.RecursivelyComputable.take_the_canonicalized_values, Square.RecursivelyComputable.take_the_results_at_time(t - Math.pow(2, this.level - 3)))(this));
        } else if (t === Math.pow(2, this.level - 2)) {
          return this.result();
        } else if (t > Math.pow(2, this.level - 2)) {
          throw "I can't go further forward than " + (Math.pow(2, this.level - 2));
        }
      };

      return RecursivelyComputable;

    })(Square);
    Square.Seed.prototype.result_at_time = function(t) {
      if (t === 0) {
        return Square["for"]({
          nw: this.nw.se,
          ne: this.ne.sw,
          se: this.se.nw,
          sw: this.sw.ne
        });
      } else if (t === 1) {
        return this.result();
      } else if (t > 1) {
        throw "I can't go further forward than " + (Math.pow(2, this.level - 2));
      }
    };
    _.extend(Cell.prototype, {
      empty_copy: function() {
        return Cell.Dead;
      }
    });
    _.extend(Square.prototype, {
      empty_copy: function() {
        var empty_quadrant;
        empty_quadrant = this.nw.empty_copy();
        return Square["for"]({
          nw: empty_quadrant,
          ne: empty_quadrant,
          se: empty_quadrant,
          sw: empty_quadrant
        });
      },
      pad_by: function(extant) {
        var empty_quadrant;
        if (extant === 0) {
          return this;
        } else {
          empty_quadrant = this.nw.empty_copy();
          return Square["for"]({
            nw: Square["for"]({
              nw: empty_quadrant,
              ne: empty_quadrant,
              se: this.nw,
              sw: empty_quadrant
            }),
            ne: Square["for"]({
              nw: empty_quadrant,
              ne: empty_quadrant,
              se: empty_quadrant,
              sw: this.ne
            }),
            se: Square["for"]({
              nw: this.se,
              ne: empty_quadrant,
              se: empty_quadrant,
              sw: empty_quadrant
            }),
            sw: Square["for"]({
              nw: empty_quadrant,
              ne: this.sw,
              se: empty_quadrant,
              sw: empty_quadrant
            })
          }).pad_by(extant - 1);
        }
      },
      future_at_time: function(t) {
        var base, new_level, new_size;
        if (t < 0) {
          throw "We do not have a time machine";
        } else if (t === 0) {
          return this;
        } else {
          new_size = Math.pow(2, this.level) + (t * 2);
          new_level = Math.ceil(Math.log(new_size) / Math.log(2));
          base = this.pad_by(new_level - this.level + 1);
          return base.result_at_time(t);
        }
      }
    });
    "The following must happen *before* caching. They can't be patched independently.";
    _for = Square["for"];
    return _.extend(Square, {
      "for": function(quadrants, creator) {
        var lev;
        if (creator != null) {
          return _for(quadrants, creator);
        } else {
          lev = quadrants.nw.level;
          if (lev === 0) {
            return _for(quadrants, Square.Smallest);
          } else if (lev === 1) {
            return _for(quadrants, Square.Seed);
          } else {
            return _for(quadrants, Square.RecursivelyComputable);
          }
        }
      }
    });
  };

}).call(this);
