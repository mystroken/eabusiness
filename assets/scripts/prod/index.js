const { compileCss } = require('../helpers');
const { compileJs } = require('../helpers');


const o = {
  env: 'PROD',
};

compileCss(o);
compileJs(o);
