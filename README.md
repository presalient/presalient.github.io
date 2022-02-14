# My Personal [Website](https://stevenhuyn.github.io)

Static website with three.js and Bootstrap

GPU accelerated implementation of the late [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

## Heavily Adapted from:

https://codepen.io/asdfmario/pen/MBpVJJ

I refactored/removed redundant code as well as documented the more complex parts

Was originally just a javascript conway single threaded :(
https://www.stevenhuyn.com/old/

## TODO

- ~~Make it not so intense looking~~ There's color banding now
- ~~Add some orange ones to fight the white~~
- ~~Mouse interaction~~
- ~~Use promises to load shader files (?)~~ asynced
- ~~Store pixel's age and fade based on age to remove still life over time~~
- Texture gets overwritten, so resizing doesn't behave like it should: Should just do away with initial seed texture and add noise if u_frames < 2.
