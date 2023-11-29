import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import DevServer from 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';



const typescriptRule = (): webpack.RuleSetRule => ({
  test: /\.ts$/i,
  loader: 'ts-loader',
  exclude: '/node_modules/'
});


const assetsRule = (): webpack.RuleSetRule => ({
  test: /\.(woof|woff2|ttf|eot|otf|png)$/i,
  type: 'asset/resource',
  generator: {
    filename: '[path][hash][ext]'
  }
});


const imagesRule =(): webpack.RuleSetRule => ({
  test: /\.jpeg$/i,
  type: 'asset/resource',
  generator: {
    filename: '[path][name][ext]'
  }
});


const cssRule = (isProduction: boolean): webpack.RuleSetRule => ({
  test: /\.s[ac]ss$/i,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: !isProduction
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: !isProduction
      }
    }
  ]
});


const rules = (isProduction: boolean): webpack.RuleSetRule[] => ([
  cssRule(isProduction),
  assetsRule(),
  imagesRule(),
  typescriptRule()
]);


const htmlPlugin: HtmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './index.html'
});


const cssPlugin: MiniCssExtractPlugin = new MiniCssExtractPlugin();


const copyPlugin = (): CopyPlugin => {
  return new CopyPlugin({
    patterns: [
      {
        from: 'assets/**/*.json',
        to: '[path][name][ext]',
      }
    ]
  })
};


const devServer = (port: number): DevServer.Configuration => ({
  port,
  open: true
});


const config = (env, args): webpack.Configuration => {
  const isProduction = args.mode === 'production';
  const port = args.port || 4000;

  return {
    entry: './src/index.ts',
    mode: isProduction ? 'production' : 'development',
    output: {
      filename: '[fullhash].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      htmlPlugin,
      cssPlugin,
      copyPlugin()
    ],
    module: {
      rules: rules(isProduction)
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    optimization: {
      minimize: true,
      sideEffects: true,
      usedExports: true
    },
    devServer: devServer(port),
    ...(!isProduction ? { devtool: 'source-map' } : {})
  }
};

export default config;
