import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import riot from 'riot';
// eslint-disable-next-line no-unused-vars
import Vue from 'vue';
import PropTypes from 'prop-types';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/mode/jsx/jsx';
import './override.css';

export default class LiveEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { component: props.content || '' };
  }

  adaptVariables(text) {
    if (!text) return null;
    return ['React', 'Vue', 'riot']
      .map(framework => `(${framework})(?=\\.)`)
      .reduce(
        (newText, pattern) =>
          newText.replace(new RegExp(pattern, 'g'), group => `_${group.toLowerCase()}`),
        text
      );
  }

  updateComponent(newComponent) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.render({
      story: () => newComponent,
      showMain: () => {},
      showError: () => {},
      forceRender: true,
    });
  }

  render() {
    const { initialSnippet, recompile } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    setImmediate(() => this.updateComponent(this.state.component));
    return (
      <div
        id="LiveEditor"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div id="root" className="LiveEditorContent" style={{ width: '50%', overflow: 'auto' }} />
        <div style={{ width: '50%', backgroundColor: 'white', minHeight: 150 }}>
          <CodeMirror
            options={{
              mode: 'jsx',
              theme: 'ambiance',
              lineNumbers: true,
              autoCloseTags: true,
            }}
            value={initialSnippet}
            onChange={(editor, data, value) => {
              // eslint-disable-next-line no-eval
              const component = eval(this.adaptVariables(recompile(value).code))();
              this.setState({ component });
            }}
          />
        </div>
      </div>
    );
  }
}

LiveEdit.propTypes = {
  initialSnippet: PropTypes.string.isRequired,
  recompile: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
  content: PropTypes.object,
};
