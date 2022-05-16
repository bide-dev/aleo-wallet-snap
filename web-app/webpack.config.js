const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    // mode: 'production', // TODO: Setup proper
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
                : JSON.stringify("npm:aleo-snap:0.0.1"),
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
    },
};
