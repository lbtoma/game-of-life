const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const mode = process.env.NODE_ENV | "development";

module.exports = {
  mode,
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[contenthash].js",
    crossOriginLoading: "anonymous",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          reuseExistingChunk: true,
        },
        styles: {
          name: "styles",
          test: /\.((c|sa|sc)ss)$/i,
          enforce: true,
        },
      },
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 10 * 1024,
    },
    minimize: true,
    minimizer: ["...", new CssMinimizerPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new SubresourceIntegrityPlugin({
      hashFuncNames: ["sha256", "sha384"],
      enabled: process.env.NODE_ENV === "production",
    }),
    new MiniCssExtractPlugin({
      filename: "bundle-[contenthash].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**`, { nodir: true }),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    hot: true,
    port: 3000,
  },
};
