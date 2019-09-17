const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const APP_PATH = path.resolve(__dirname, "src");

module.exports = {
  entry: APP_PATH,

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|svg|ico)$/,
        loader: "file-loader",
        options: {
          publicPath: "/",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(APP_PATH, "index.html"),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};
