const { CheckerPlugin, TsConfigPathsPlugin  } = require("awesome-typescript-loader");
const TerserPlugin = require('terser-webpack-plugin');
const { resolve, join, basename, dirname } = require("path");
const pkg = require("./package.json");

const HOST = process.env.npm_package_config_host || pkg.config.host;
const PORT = process.env.npm_package_config_port || pkg.config.port;
const LIBRARY = process.env.npm_package_config_library || pkg.config.library;
const MAIN = pkg.main;
const FILENAME = basename(MAIN);
const PATH = dirname(MAIN);

module.exports = {
  mode: process.env.WEBPACK_SERVE ? "development" : "production",

  entry:  {
    'pandaemic': './src/index.ts',
    'pandaemic.min': './src/index.ts'
  },

  output: {
    filename: '[name].js',
    path: join(__dirname, PATH),
    publicPath: "/",
    library: 'pandaemic_lib',
    libraryTarget: "var",
    globalObject: "this"
  },

  devtool: "source-map",

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsConfigPathsPlugin()]
  },

  module: {
    rules: [
      {
        test : /\.ts$/,
        use : {
            loader : 'awesome-typescript-loader',
            options : { reportFiles: ['src/**/*.{ts,tsx}'] },
        },
      }
    ]
  },

  plugins: [
    new CheckerPlugin()
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  },

  serve: {
    host: HOST,
    port: PORT,
    content: [__dirname]
  }
};
