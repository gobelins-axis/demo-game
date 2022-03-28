const paths = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /**
   * Entry
   *
   * The first place Webpack looks to start building the bundle.
   */
    entry: [paths.js + '/index.js'],

    /**
   * Output
   *
   * Where Webpack outputs the assets and bundles.
   */
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    /**
   * Plugins
   *
   * Customize the Webpack build process.
   */
    plugins: [
    /**
     * CleanWebpackPlugin
     *
     * Removes/cleans build folders and unused assets when rebuilding.
     */
        new CleanWebpackPlugin(),

        /**
     * CopyWebpackPlugin
     *
     * Copies files from target to destination folder.
     */
        new CopyWebpackPlugin([
            {
                from: paths.static,
                to: 'assets',
                ignore: ['*.DS_Store'],
            },
        ]),

        /**
     * HtmlWebpackPlugin
     *
     * Generates an HTML file from a template.
     */
        new HtmlWebpackPlugin({
            title: 'Demo Game Arcade Feu',
            template: paths.src + '/index.html', // template file
            filename: 'index.html', // output file
        }),
    ],

    /**
   * Module
   *
   * Determine how modules within the project are treated.
   */
    module: {
        rules: [
            /**
       * JavaScript
       *
       * Use Babel to transpile JavaScript files.
       */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },

            /**
       * Styles
       *
       * Inject CSS into the head with source maps.
       */
            {
                test: /\.(scss|css|sass)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },

            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg|mp4)$/i,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src',
                    // encoding: 'base64',
                },
            },

            {
                test: /\.(glb|gltf)$/i,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src',
                    // encoding: 'base64',
                },
            },

            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src',
                    // encoding: 'base64',
                },
            },
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src',
                    // encoding: 'base64',
                },
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                use: [
                    'raw-loader',
                    'glslify-loader',
                ],
            },
        ],
    },
};
