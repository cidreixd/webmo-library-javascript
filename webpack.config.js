var path = require('path');
var webpack = require('webpack');
var MINIFY = JSON.parse(process.env.MINIFY || "0");

module.exports = {
    entry: "./index.js",
    devtool: "source-map",
    output: {
        path: path.join(__dirname, "dist"),
        libraryTarget: "var",
        library: "Webmo",
        filename: MINIFY ? "webmo.min.js" : "webmo.js"
    },
    plugins: MINIFY ? [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : []
};
