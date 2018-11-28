module.exports = (env, thread) => {
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';

  const isRenderer = thread === 'renderer';
  const isMain = thread === 'main';

  return {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          targets: { electron: require('electron/package.json').version },
          useBuiltIns: false,
          modules: false,
        },
      ],
      isRenderer && [
        require('@babel/preset-react').default,
        {
          development: isEnvDevelopment,
          useBuiltIns: true,
        },
      ],
    ].filter(Boolean),
    plugins: [
      require('@babel/plugin-transform-destructuring').default,
      [
        require('@babel/plugin-proposal-class-properties').default,
        { loose: true },
      ],
      [
        require('@babel/plugin-proposal-object-rest-spread').default,
        { useBuiltIns: true },
      ],
      [
        require('@babel/plugin-transform-runtime').default,
        { corejs: false, helpers: false, regenerator: true },
      ],
      isEnvProduction &&
        isRenderer && [
          require('babel-plugin-transform-react-remove-prop-types').default,
          { removeImport: true },
        ],
      require('@babel/plugin-syntax-dynamic-import').default,
      isMain && require('babel-plugin-dynamic-import-node'),
    ].filter(Boolean),
  };
};
