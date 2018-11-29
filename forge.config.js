module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './config/webpack.config.main.js',
        renderer: {
          config: './config/webpack.config.renderer.js',
          entryPoints: [
            {
              html: './src/renderer-main/index.html',
              js: './src/renderer-main/index.js',
              preload: { js: './src/renderer-main/preload.js' },
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
};
