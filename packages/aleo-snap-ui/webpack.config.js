const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    mode: "development",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index.bundle.js",
    },
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /nodeModules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            favicon: "./public/favicon.ico",
        }),
        new webpack.DefinePlugin({
            __SNAP_ID__: isDev
                ? JSON.stringify("local:http://localhost:8081/")
                : JSON.stringify("npm:aleo-snap"), // TODO: Pin to a specific version
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
    },
};
