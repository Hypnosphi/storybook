import React from 'react';
import { storiesOf } from '@storybook/react';
import { withEnabledLiveEdit } from '@storybook/addon-liveedit';

storiesOf('Addons|Live Edit', module).add('first test', () =>
  withEnabledLiveEdit(
    <div>
      <h1>Title</h1>
      <h2>Sub title</h2>
      <div>Some text</div>
      <pre>
        &lt;html&gt;&lt;body&gt;escaped text&lt;/body&gt;&lt;html&gt;
        <br />
        <br />
        {`int main (int argc, char* argv) {
        printf('Hello');
}`}
      </pre>
    </div>
  )
);
