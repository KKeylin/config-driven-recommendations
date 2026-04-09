const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: { loader: 'ts-loader', options: { transpileOnly: true } },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'testimonialsRemote',
        filename: 'remoteEntry.js',
        exposes: {
          './TestimonialsWidget': './src/TestimonialsWidget',
        },
        shared: {
          react: { singleton: true, requiredVersion: '>=18' },
          'react-dom': { singleton: true, requiredVersion: '>=18' },
        },
      }),
    ],
    devServer: {
      port: 3001,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};