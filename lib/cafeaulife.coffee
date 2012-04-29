# # Cafe au Life

## What

# Cafe au Life is an implementation of John Conway's [Game of Life][life] cellular automata
# written in [CoffeeScript][cs]. Cafe au Life runs on [Node.js][node], it is not designed
# to run as an interactive program in a browser window.
#
# Cafe au Life's Github project is [here](https://github.com/recursiveuniverse/recursiveuniverse.github.com/).
#
# This file, [cafeaulife.coffee][source] contains the core engine for computing the future of any life universe
# of size `2^n | n > 1`. The algorithm is optimized for computing very large numbers of generations
#  of very large and complex life patterns with a high degree of regularity such as implementing
# Turing machines.
#
# As such, it is particularly poorly suited for animating displays a generation at a time. But it
# is still a beautiful algorithm that touches on the soul of life’s “physics."
#
# ![Period 24 Glider Gun](http:Trueperiod24gun.png)
#
# *(A period 24 Glider Gun. Gliders of different periods are useful for synchronizing signals in complex
# Life machines.)*
#
# ### Conway's Life and other two-dimensional cellular automata
#
# The Life Universe is an infinite two-dimensional matrix of cells. Cells are indivisible and are in either of two states,
# commonly called "alive" and "dead." Time is represented as discrete quanta called either "ticks" or "generations."
# With each generation, a rule is applied to decide the state the cell will assume. The rules are decided simultaneously,
# and there are only two considerations: The current state of the cell, and the states of the cells in its
# [Moore Neighbourhood][moore], the eight cells adjacent horizontally, vertically, or diagonally.
#
# Cafe au Life implements Conway's Game of Life, as well as other "[life-like][ll]" games in the same family.
#
# [ll]: http://www.conwaylife.com/wiki/Cellular_automaton#Well-known_Life-like_cellular_automata
# [moore]: http://en.wikipedia.org/wiki/Moore_neighborhood
# [source]: https://github.com/recursiveuniverse/recursiveuniverse.github.com/blob/master/lib
# [life]: http://en.wikipedia.org/wiki/Conway's_Game_of_Life
# [cs]: http://jashkenas.github.com/coffee-script/
# [node]: http://nodejs.org
#
# ## Why
#
# Cafe au Life is based on Bill Gosper's brilliant [HashLife][hl] algorithm. HashLife is usually implemented in C and optimized
# to run very long simulations with very large 'boards' stinking fast. The HashLife algorithm is, in a word,
# **a beautiful design**, one that is "in the book." To read its description is to feel the desire to explore it on a computer.
#
# Broadly speaking, HashLife has two major components. The first is a high level algorithm that is implementation independent.
# This algorithm exploits repetition and redundancy, aggressively 'caching' previously computed results for regions of the board.
# The second component is the cache itself, which is normally implemented cleverly in C to exploit memory and CPU efficiency
# in looking up precomputed results.
#
# Cafe au Life is an exercise in exploring the beauty of HashLife's recursive caching or results, while accepting that the
# performance in a JavaScript application will not be anything to write home about.
#
# [hl]: http://en.wikipedia.org/wiki/Hashlife

# Cafe au Life is divided into modules:
#
# * The [Rules Module][rules] provides a method for setting up the [rules][ll] of the Life universe.
# * The [Future Module][future] provides methods for computing the future of a pattern, taking into account its ability to grow beyond
# the size of its container square.
# * The [Cache Module][cache] implements a very naive hash-table for canoncial representations of squares. HashLife uses extensive
# [canonicalization][canonical] to optimize the storage of very large patterns with repetitive components.
# * The [Garbage Collection Module][gc] implements a simple reference-counting garbage collector for the cache. For more information,
# read [Implementing Garbage Collection in CS/JS with Aspect-Oriented Programming][igc]
# * The [API Module][api] provides methods for grabbing json or strings of patterns and resizing them to fit expectations.
# * The [Menagerie Module][menagerie] provides a few well-know life objects predefined for you to play with. It is entirely optional.
#
# The modules will build up the functionality of our `Cell` and `Square` classes.
#
# [menagerie]: http:menagerie.html
# [api]: http:api.html
# [future]: http:future.html
# [cache]: http:cache.html
# [canonical]: https://en.wikipedia.org/wiki/Canonicalization
# [rules]: http:rules.html
# [gc]: http:gc.html
# [ll]: http://www.conwaylife.com/wiki/Cellular_automaton#Well-known_Life-like_cellular_automata
# [igc]: https://github.com/raganwald/homoiconic/blob/master/2012/03/garbage_collection_in_coffeescript.md

_ = require('underscore')

universe = require('./universe')
require('./future').mixInto(universe)
require('./cache').mixInto(universe)
require('./gc').mixInto(universe)
require('./api').mixInto(universe)

_.defaults exports, universe

# ## The first time through
#
# If this is your first time through the code, start with the [Rules Module][rules], and then read the [Future Module][future]
# to understand the core algorithm for computing the future of a pattern. You can look at the [Cache][cache], [Garbage Collection][gc],
# and [API][api] modules at your leisure.
#
# [menagerie]: http:menagerie.html
# [api]: http:api.html
# [future]: http:future.html
# [cache]: http:cache.html
# [canonical]: https://en.wikipedia.org/wiki/Canonicalization
# [rules]: http:rules.html
# [gc]: http:gc.html

# ## Todo List
#
# TODO: Extract basic cell and square classes into quadtree or universe module so that while cafeaulife.coff imports everything, it's possible to mix and match modules as desired.
#
# TODO: Extract futures module so that it can run in naïve brute force mode without it
#
# TODO: Support changing the rules during a run.
#
# TODO: Decouple canonicalization so that it can work with or without the cache module. If the cache and future modules are removed, it should only take advantage of repetition during the current iteration

# ## Who
#
# When he's not shipping Ruby, Javascript and Java applications scaling out to millions of users,
# [Reg "Raganwald" Braithwaite](http://braythwayt.com) has authored libraries for Javascript and Ruby programming
# such as [Katy](https://github.com/raganwald/Katy), [JQuery Combinators](http://github.com/raganwald/JQuery-Combinators),
# [YouAreDaChef](https://github.com/raganwald/YouAreDaChef), [andand](http://github.com/raganwald/andand),
# and more you can find on [Github](https://github.com/raganwald).
#
# He has written three books:
#
# * [Kestrels, Quirky Birds, and Hopeless Egocentricity](http://leanpub.com/combinators): *Raganwald's collected adventures in Combinatory Logic and Ruby Meta-Programming*
# * [What I've Learned From Failure](http://leanpub.com/shippingsoftware): *A quarter-century of experience shipping software, distilled into fixnum bittersweet essays*
# * [How to Do What You Love & Earn What You’re Worth as a Programmer](http://leanpub.com/dowhatyoulove)
#
# His hands-on coding blog [Homoiconic](https://github.com/raganwald/homoiconic) frequently lights up the Hackerverse,
# and he also writes about [project management and other subjects](http://raganwald.posterous.com/).

# ---
#
# **(c) 2012 [Reg Braithwaite](http://braythwayt.com)** ([@raganwald](http://twitter.com/raganwald))
#
# Cafe au Life is freely distributable under the terms of the [MIT license](http://en.wikipedia.org/wiki/MIT_License).
#
# The annotated source code was generated directly from the [original source][source] using [Docco][docco].
#
# [source]: https://github.com/recursiveuniverse/recursiveuniverse.github.com/blob/master/lib
# [docco]: http://jashkenas.github.com/docco/