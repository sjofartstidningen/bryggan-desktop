const babel = require('./babel.config');

const env = process.env.NODE_ENV;

module.exports = {
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            ...babel(env, 'renderer'),
          },
        },
      },
    ],
  },
};
