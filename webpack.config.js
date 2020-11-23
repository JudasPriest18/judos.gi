const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { template } = require('lodash')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const { userInfo } = require('os')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

console.log('IS DEV:', isDev)

const optimization = () => {
    const config = {
        splitChunks: {
            chunks:'all'
        }
    }

    if (isProd)  {
        config.minimizer = [
           new OptimizeCssAssetsPlugin(),
           new TerserWebpackPlugin()
        ]
    }

    return config
}
    
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        maim: './index.js',
        analytics: './analytics.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    }, 

     optimization: optimization(),
    
     devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 4200,
    },
    
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify:{
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
        patterns:[
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname,'dist'),
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname,'dist/assets')
            }

        ]}),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
          }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: './',
                      },
                    },
                    'css-loader',
                  ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|waff|waff2|eot)$/,
                use: ['file-loader']
            }
        ]
    }
}
