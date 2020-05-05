const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src", "app"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  // plugins: [
  //   // To strip all locales except “en”
  //   new MomentLocalesPlugin(),

  //   new MomentLocalesPlugin({
  //     localesToKeep: ["fa"],
  //   }),
  // ],
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        loader: ["css-loader"],
      },
    ],
  },
};
