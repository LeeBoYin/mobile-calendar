const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader' },
			{ test: /\.vue$/, use: 'vue-loader' },
			{ test: /\.(sa|sc|c)ss$/, use: ['vue-style-loader', 'css-loader', 'sass-loader']},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/',
						},
					},
				],
			},
		]
	},
	devServer: {
		open: false,
		hot: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			jquery: 'jquery',
			$: 'jquery',
			"window.jQuery": "jquery"
		})
	]
};
