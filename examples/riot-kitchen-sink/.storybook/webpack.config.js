module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: {
          targets: ['StorySource', 'LiveEdit'],
          sourcePresets: ['es2015'],
        }, // no support for babel 7 yet
      },
    ],
    enforce: 'pre',
  });

  defaultConfig.module.rules.push({
    test: /\.txt$/,
    use: 'raw-loader',
  });

  // eslint-disable-next-line no-param-reassign
  defaultConfig.watchOptions = {
    poll: 10000,
  };

  // eslint-disable-next-line no-param-reassign
  defaultConfig.resolve.alias.STORYBOOK_FRAMEWORK = '@storybook/riot';

  return defaultConfig;
};
