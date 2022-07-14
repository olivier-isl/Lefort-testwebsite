const HtmlWebpackPlugin = require('html-webpack-plugin')
exports.loadPug = (options) => ({
	module: {
		rules: [{
			test: /\.pug$/,
			use: [{
					loader: 'html-loader'
				},
				{
					loader: 'pug-html-loader',
					options
				}
			]
		}]
	}
})

exports.page = ({
	path = '',
	template = require.resolve(
		'html-webpack-plugin/default_index.ejs'
	),
	title,
	entry,
	chunks
} = {}) => ({
	entry,
	plugins: [
		new HtmlWebpackPlugin({
			filename: `${path && path + '/'}index.html`,
			template,
			title,
			chunks
		})
	]
})