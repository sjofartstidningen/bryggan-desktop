exports.webpack = config =>
  Object.assign(config, {
    target: 'electron-renderer',
    devtool: 'cheap-module-source-map',
  });

exports.exportPathMap = () => ({
  '/file-picker': { page: '/file-picker' },
});
