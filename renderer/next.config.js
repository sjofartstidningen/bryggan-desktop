require('dotenv').config();
const webpack = require('webpack');

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
    plugins: [
      ...config.plugins,
      new webpack.EnvironmentPlugin([
        'DROPBOX_OAUTH_CLIENT_ID',
        'DROPBOX_OAUTH_CLIENT_SECRET',
      ]),
    ],
  });

exports.exportPathMap = () => ({
  '/file-picker': { page: '/file-picker' },
  '/authorize': { page: '/authorize' },
  '/open-file': { page: '/open-file' },
});
