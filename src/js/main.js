requirejs.config({
  baseUrl: 'src/js',
  paths: {
    'text': '../../vendor/js/require/text',
    'jsx': '../../vendor/js/require/jsx',
    'JSXTransformer': '../../vendor/js/require/JSXTransformer-0.10.0',
    'react': '../../vendor/js/react-0.10.0',
    'rsvp': '../../vendor/js/rsvp',
  },

  jsx: {
    fileExtension: '.jsx'
  }
});

require([ 'boot' ]);