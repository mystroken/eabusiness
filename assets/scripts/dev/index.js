// eslint-disable-next-line import/no-extraneous-dependencies
const watch = require('node-watch');
const config = require('../../config.js');
const { compileCss } = require('../helpers');
const { compileJs } = require('../helpers');

const o = {
  env: 'DEV',
};

compileCss(o);
compileJs(o);

watch(config.css.watch, { recursive: true }, () => {
  compileCss(o);
});

watch(config.js.watch, { recursive: true }, () => {
  compileJs(o);
});
