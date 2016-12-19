var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '../data');
var APP_DIR = path.resolve(__dirname, './src');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
              // This has effect on the react lib size
              'NODE_ENV': JSON.stringify('production'),
            },
      }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000" 
      },
      { 
        test: /\.jpg$/, 
        loader: 'url?limit=60000'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=60000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=60000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=60000&mimetype=application/vnd.ms-fontobject'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=110000&mimetype=image/svg+xml'
      }
    ]
  }
};

module.exports = config;
