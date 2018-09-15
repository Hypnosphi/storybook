import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import riot from 'riot';
// eslint-disable-next-line no-unused-vars
import Vue from 'vue';
import { renderToString } from 'react-dom/server';
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
    this.state = { component: props.children };
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

  render() {
    const { initialSnippet, recompile } = this.props;
    let rendered;
    try {
      // eslint-disable-next-line react/destructuring-assignment
      rendered = renderToString(this.state.component);
    } catch (e) {
      rendered = `<div class="sb-show-errordisplay"><div class="sb-errordisplay">
                  <div id="error-message" class="sb-heading">${e.toString()}</div></div></div>`;
    }
    // dangerouslySetInnerHTML instead of child to still display the editor in case of failure
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{ width: '50%', overflow: 'auto' }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
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
  children: PropTypes.node.isRequired,
};
