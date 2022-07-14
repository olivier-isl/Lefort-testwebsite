const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlPlugin = require('html-webpack-plugin')

const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');
const data = {
	index: ['./js/index.js'],
	agenda: ['./js/agenda.js'],
	agendas: ['./js/agendas.js']
}

const mode = ['development', 'production']

const paths = {
	sourceDir: 'app',
	buildDir: 'build',
	staticDir: '',
	images: 'src/img',
	fonts: 'fonts',
	js: 'js',
	css: 'styles'
}


module.exports = {
	mode: mode[0],
	entry: data,
	devtool: 'inline-source-map',
	devServer: {
		inline: true,
		contentBase: path.join(__dirname, '../lefort-dist'),
		compress: true,
		port: 9000,
		watchOptions: {
			index: 'index.html',
			open: true,
			poll: 1000,
			watchContentBase: true,
			aggregateTimeout: 200,
		}
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		// new CleanWebpackPlugin({
		// 	cleanStaleWebpackAssets: false
		// }),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
		}),
		new HtmlPlugin({
			template: './pages/index.pug',
			filename: 'index.html',
			chunks: ['index']
		}),
		new HtmlPlugin({
			template: './pages/agenda.pug',
			filename: 'agenda.html',
			chunks: ['agenda']
		}),
		new HtmlPlugin({
			template: './pages/agendas.pug',
			filename: 'agendas.html',
			chunks: ['agendas']
		}),
	],
	resolve: {
		modules: [path.resolve(__dirname, 'test'), 'node_modules'],
		extensions: ['.json', '.js', '.jsx', '.css', '.scss', '.ts'],
		alias: {
			// Provides ability to include node_modules with ~
			'~': path.resolve(process.cwd(), 'node_modules'),
			'@': path.resolve(process.cwd(), 'src'),
		},
	},
	module: {
		rules: [{
				//tell webpack to use jsx-loader for all *.jsx files
				test: /\.(m?js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.pug$/i,
				use: [
					'pug-loader',
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// fallback to style-loader in development
					{
						loader: 'style-loader'
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
							url: false,
							importLoaders: 2,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [autoprefixer(), cssnano()]
							},
							sourceMap: true,
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: [path.resolve(__dirname, 'node_modules', 'bootstrap-sass', 'bootstrap', 'assets', 'stylesheets')],
							},
							sourceMap: true,
						},
					}
				],
				include: [
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, 'scss')
				],
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					{
						loader: "css-loader",
						options: {
							url: false,
							importLoaders: 2,
							sourceMap: true
						}
					},
				],
			},
			{
				test: /\.(png|jpg|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 15000,
						name: `${paths.images}/[name].[hash:8].[ext]`
					}
				}
			},
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../lefort-dist'),
		publicPath: '/',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		runtimeChunk: 'single'
		// minimizer: [
		// 	new OptimizeCSSAssetsPlugin({
		// 		cssProcessorOptions: {
		// 			safe: true
		// 		}
		// 	})
		// ]
	},
}