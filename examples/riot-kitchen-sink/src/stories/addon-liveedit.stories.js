import { storiesOf } from '@storybook/riot';
import { withEnabledLiveEdit } from '@storybook/addon-liveedit';
import SimpleTestRaw from './SimpleTest.txt';
import './AnotherTest.tag';

storiesOf('Story|How to edit a template live', module)
  .add(
    'built as string',
    withEnabledLiveEdit(() => ({ tags: ['<test><div>simple test</div></test>'] }))
  )

  .add(
    'built from tags and template',
    withEnabledLiveEdit(() => ({
      tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
      template:
        '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
    }))
  );
