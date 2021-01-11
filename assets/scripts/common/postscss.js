const fs = require('fs');
const postcss = require('postcss');
const easyImport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const postcssMerge = require('postcss-merge-selectors');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');

module.exports = o => {
  const production = o.env === 'PROD';
  const css = fs.readFileSync(o.entry, 'utf8');

  // PostCSS plugins
  const plugins = [
    easyImport({
      partial: true,
      extensions: ['.scss'],
      glob: true,
	}),
	// postcssMerge(), // combine selectors that have identical rules.
	mqpacker(), // A tool for packing same CSS media query rules into one
    autoprefixer(),
  ];

  if (production) {
    plugins.push(cssnano);
  }

  // PostCSS
  postcss(plugins)
    .process(css, { from: o.entry })
    .then(result => fs.writeFileSync(o.dest, result.css) )
    .then(() => {
      if (o.cb) o.cb();
    })
    .catch(error => console.error(error))
  ;
}
