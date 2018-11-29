const path = require('path');
const babel = require('./babel.config');

const env = process.env.NODE_ENV;

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
  target: 'electron-main',
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                ...babel(env, 'main'),
              },
            },
          },
          {
            test: /\.(svg|jpg|png)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  emitFile: true,
                  // name: '[path][name].[ext]',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
