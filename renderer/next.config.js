const packagesToIgnore = ['electron-better-ipc'];

exports.webpack = config =>
  Object.assign(config, {
    target: 'electron-renderer',
    devtool: 'cheap-module-source-map',
    externals: [
      ...(config.externals || []),
      (context, request, callback) => {
        if (packagesToIgnore.includes(request)) {
          return callback(null, `require("${request}")`);
        }

        return callback();
      },
    ],
  });

exports.exportPathMap = () => ({
  '/file-picker': { page: '/file-picker' },
});
