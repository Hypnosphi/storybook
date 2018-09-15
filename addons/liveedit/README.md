# Storybook Live Edit Addon

This addon is used to display and edit the story source.
It is an addition to the StorySource and must be imported altogether.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Live Edit Demo](demo.gif)

## Getting Started

First, install the addon and the StorySource dependency

```sh
npm install -D @storybook/addon-liveedit
npm install -D @storybook/addon-storysource
```

Add this line to your `addons.js` file

```js
import '@storybook/addon-storysource/register';
```

Use this hook to a custom webpack.config. This will generate a decorator call in every story:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
              targets: ['StorySource' /* <--only if you use the storysource addon*/, 
                        'LiveEdit'],
              sourcePresets: ['es2015', 'react'],
            }, // no support for babel 7 yet
          },
        ],
        enforce: 'pre',
      },
    ],
  },
};
```

