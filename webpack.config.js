var path = require('path')
module.exports = {
  devtool: 'source-map',
	mode: 'development',
	entry: './src/state.js',
	output: {
		path: path.join(__dirname, "dist"),
		filename: 'vue-app-state.umd.js',
		library: 'VueAppState',
		libraryTarget: "umd"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
