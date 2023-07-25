const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    popup: "./src/popup.jsx",
    content: "./src/contents/content.js",
    background: "./src/background.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src/styles"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/popup.html",
      filename: "popup.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
        },
      ],
    }),
  ],
};
