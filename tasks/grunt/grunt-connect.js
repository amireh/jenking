module.exports = {
  www: {
    proxies: [{
      context: '/api',
      host: 'localhost',
      port: 8777,
      https: false,
      changeOrigin: false,
      xforward: false,
      rewrite: {
        '^/api': '',
      }
    }],
    options: {
      keepalive: true,
      port: 8000,
      base: 'www',
      logger: 'dev',
      hostname: '127.0.0.1',
      middleware: function (connect, options) {
        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
        var middlewares = [ proxy ];
        var directory;

        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        // Serve static files.
        options.base.forEach(function (base) {
          middlewares.push(connect.static(base));
        });

        // Make directory browse-able.
        directory = options.directory || options.base[options.base.length - 1];
        middlewares.push(connect.directory(directory));

        return middlewares;
      }
    }
  }
};
