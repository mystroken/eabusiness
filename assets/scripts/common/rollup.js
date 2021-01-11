const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs'); // Solve problems of node modules import
const resolve = require('rollup-plugin-node-resolve'); // Solve problems of node modules import
const terser = require('rollup-plugin-terser').terser;

module.exports = o => {
  const production = o.env === 'PROD';

  // Rollup plugins
  const plugins = [
    resolve(), // support modules from node_modules.
    commonjs({ // support of require.
      include: 'node_modules/**',
    }),
  ];

  if (production) {
    // Babel transpilation
    plugins.push(
      babel({
        babelrc: false,
        presets: [['@babel/preset-env', { 'modules': false }]]
      })
    );
    // minification
    plugins.push(terser());
  }

  // Rollup
  rollup
    .rollup({
      input: o.entry,
      plugins
    })
    .then(bundle => {
      bundle
        .write({
          file: o.dest,
          format: 'iife'
        })
        .then(o.cb)
      ;
    })
  ;
};
