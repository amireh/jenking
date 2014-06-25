requirejs.config({
  baseUrl: 'src/js',
  map: {
    '*': {
      'lodash': 'underscore'
    }
  },
  paths: {
    'text': '../../vendor/js/require/text',
    'jsx': '../../vendor/js/require/jsx',
    'JSXTransformer': '../../vendor/js/require/JSXTransformer-0.10.0',
    'react': '../../vendor/js/react-0.10.0',
    'underscore': '../../vendor/js/lodash/lodash.custom',
    'lodash': '../../vendor/js/lodash/lodash.custom',
  },

  shim: {
    'underscore': { exports: '_' },
    'lodash': { exports: '_' },
  },

  jsx: {
    fileExtension: '.jsx'
  }
});

require([ 'boot' ]);