module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: { name: 'bryggan_desktop' },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
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
              html: './src/main/index.html',
              js: './src/main/index.js',
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
};
