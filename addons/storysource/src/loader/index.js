import { getOptions } from 'loader-utils';
import injectDecorator from './inject-decorator';

function transform(source) {
  const options = getOptions(this) || {};
  const targets = options.targets || ['StorySource'];
  const sourcePresets = options.sourcePresets || [];
  const addDecoratorStatement = `${targets
    .map(target => `.addDecorator(with${target}(__STORY__, __ADDS_MAP__, __SOURCE_PRESETS__))`)
    .join('')}`;
  const result = injectDecorator(source, addDecoratorStatement, this.resourcePath, options);

  if (!result.changed) {
    return source;
  }

  const sourceJson = JSON.stringify(result.storySource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const addsMap = JSON.stringify(result.addsMap);

  return `
  ${targets
    .map(
      target => `
  export var with${target} = require('@storybook/addon-${target.toLowerCase()}').with${target};
  `
    )
    .join('')}
  export var __STORY__ = ${sourceJson};
  export var __ADDS_MAP__ = ${addsMap};
  export var __SOURCE_PRESETS__ = ${JSON.stringify(sourcePresets)}
  
  ${result.source}
  `;
}

export default transform;
