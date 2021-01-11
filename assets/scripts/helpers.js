/* eslint-disable */

const fs = require('fs');
const sass = require('node-sass');
const config = require('./../config.js');
const postcss = require('./common/postscss');
const rollup = require('./common/rollup');

function compileJs(o) {
  rollup({
    env: o.env,
    entry: config.js.entry,
    dest: config.js.dest,
    cb: _ => console.log('JS Compiled !')
  });
}

function compileCss(o) {
  sass.render({
    file: config.css.entry,
    outputStyle: 'expanded',
    outFile: config.css.dest,
    sourceMap: true
  }, (error, result) => {
    if (!error) {
      fs.writeFile(config.css.dest, result.css, function(err){
        if(!err){
          //file written on disk
          postcss({
            env: o.env,
            entry: config.css.dest,
            dest: config.css.dest,
            cb: _ => console.log('CSS Compiled !')
          });
        }
      });
    }
  });
}

module.exports = {
  compileCss,
  compileJs
};
