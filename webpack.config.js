const path = require('path');

const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NgcWebpackPlugin = require('ngc-webpack').NgcWebpackPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');


//=========================================================
//  VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const HOST = '0.0.0.0';
const PORT = 3000;


//=========================================================
//  RULES
//---------------------------------------------------------
const rules = {
  'css': {
    test: /\.css$/,
    use: ['raw', 'postcss']
  },
  'html': {
    test: /\.html$/,
    use: ['html-loader'],
    include: path.resolve('src')
  },
  'sass': {
    test: /\.scss$/,
    use: ['raw-loader', 'postcss-loader', 'sass-loader'],
    include: path.resolve('src')
  },
  'typescript': {
    test: /\.ts$/,
    use: ['awesome-typescript-loader', 'angular2-template-loader']
  }
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.resolve = {
  extensions: ['.js', '.ts'],
  mainFields: ['module', 'browser', 'main'],
  modules: [
    path.resolve('.'),
    'node_modules'
  ]
};

config.performance = {
    hints : false
}

config.module = {
  rules: [
    rules.sass,
    rules.typescript,
    rules.html
  ]
};

config.plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  new LoaderOptionsPlugin({
    debug: false,
    options: {
      postcss: [
        autoprefixer({browsers: ['last 3 versions']})
      ]
    }
  }),
  new ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    path.resolve('src')
  ),
  new CheckerPlugin()
];


//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  
  config.entry = {
    polyfills: './src/polyfills.ts'
  };

  config.output = {
    path: path.resolve('./dist'),
    publicPath: '/'
  };

  config.plugins.push(
    new CommonsChunkPlugin({
      chunks: ['polyfills'],
      name: 'polyfills'
    }),
    new CommonsChunkPlugin({
      chunks: ['main'],
      minChunks: module => /node_modules\//.test(module.resource),
      name: 'vendor'
    }),
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: './src/index.html'
    })
  );
}


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {

  config.devtool = 'cheap-module-source-map';

  config.entry.main = './src/main.jit.ts';

  config.output.filename = '[name].js';

  config.plugins.push(new ProgressPlugin());

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    port: PORT,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  };
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {

  config.devtool = 'source-map';

  config.entry.main = './src/main.aot.ts';

  config.output.filename = '[name].[chunkhash].js';

  config.plugins.push(
    new NgcWebpackPlugin({
      disabled: false,
      tsConfig: path.resolve('tsconfig.json')
    }),
    new WebpackMd5Hash(),
    new UglifyJsPlugin({
      comments: false,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true  // eslint-disable-line camelcase
      }
    })
  );
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';
}
