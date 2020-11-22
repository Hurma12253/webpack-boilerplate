const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtract = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

console.log(isProd)

const filename = ext => isProd ? `bundle.[hash].${ext}` : `bundle.${ext}`
const jsLoaders = () =>{
  const loaders = [
    {
      loader:'babel-loader',
      options:{
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      }
    }
  ]

  if(isDev){
    loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
    context : path.resolve(__dirname,'src'),
    mode: 'production',
    entry: ['@babel/polyfill','./index.js'],
    output:{
        filename: filename('js'),
        path: path.resolve(__dirname,'dist')
    },
    resolve:{
        extensions:['.js'],
        alias:{
            '@images': path.resolve(__dirname,'src/images')
        }
    },
    devServer:{
      port:3000,
      hot:isDev
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify:{
              removeComments:isProd,
              collapseWhitespace:isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                { 
                  from: path.resolve(__dirname,'src/favicon.ico'), 
                  to: path.resolve(__dirname,'dist') 
                },
                // {
                //   from: path.resolve(__dirname,'src/images'),
                //   to: path.resolve(__dirname,'dist/images')
                // }
            ],
          }),
        new MiniCssExtract({
            filename:filename('css')
        })
    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              {
                loader:MiniCssExtract.loader,
                options:{
                  hmr:isDev,
                  reloadAll:true
                }
              },
              'css-loader',
              'sass-loader',
            ],
          },
          { 
            test: /\.js$/, 
            exclude: /node_modules/, 
            use: jsLoaders()
          },
          {
            test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot)$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "[name].[ext]",
                  outputPath: "assets/images",
                  publicPath: 'images',
                }
              }
            ]
          },
        ],
      },
}