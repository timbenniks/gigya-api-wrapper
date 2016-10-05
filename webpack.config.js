var webpack = require( 'webpack' ),
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    env = process.env.WEBPACK_ENV,
    path = require('path'),
    libraryName = 'gigyaWrapper',
    plugins = [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin()
    ],
    outputFile;

if( env === 'build' ){
  plugins.push( new UglifyJsPlugin( { minimize: true } ) );
  plugins.push( new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify('production')
      }
    })
  );
  
  outputFile = libraryName + '.min.js';
}
else {
  outputFile = libraryName + '.js';
}

var config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel',
      exclude: /(node_modules)/
    },{
      test: /(\.jsx|\.js)$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins
};

module.exports = config;
