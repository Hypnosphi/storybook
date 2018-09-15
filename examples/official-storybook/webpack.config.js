const path = require('path');
const { DefinePlugin, ContextReplacementPlugin } = require('webpack');

module.exports = (baseConfig, env, defaultConfig) => ({
  ...defaultConfig,
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.stories\.jsx?$/,
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
              targets: ['StorySource', 'LiveEdit'],
              sourcePresets: ['es2015', 'react'],
            }, // no support for babel 7 yet
          },
        ],
        include: [
          path.resolve(__dirname, './stories'),
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
        enforce: 'pre',
      },
      {
        test: /\.js/,
        use: defaultConfig.module.rules[0].use,
        include: [
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
      },
    ],
  },
  resolve: {
    ...defaultConfig.resolve,
    // https://github.com/graphql/graphql-js#using-in-a-browser
    extensions: ['.mjs', ...defaultConfig.resolve.extensions],
  },
  plugins: [
    ...defaultConfig.plugins,
    // graphql sources check process variable
    new DefinePlugin({
      process: JSON.stringify(true),
    }),
    // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400
    new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/),
  ],
  watchOptions: {
    poll: 10000,
  },
});
