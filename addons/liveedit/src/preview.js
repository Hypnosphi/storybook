import React from 'react';
import addons from '@storybook/addons';
import coreEvents from '@storybook/core-events';
import { document } from 'global';
import { transform } from '@babel/standalone';
// eslint-disable-next-line import/no-unresolved,import/extensions
import render from 'STORYBOOK_FRAMEWORK/dist/client/preview/render';
import { EVENT_ID } from './events';
import LiveEdit from './LiveEdit';

let removeLiveEditorDefined = false;

function getLocation(context, locationsMap) {
  return locationsMap[`${context.kind}@${context.story}`] || locationsMap[`@${context.story}`];
}

function changeLiveEditor() {
  if (document.querySelectorAll('.LiveEditorContent').length > 1)
    document.body.innerHTML = document.querySelector('#root').parentNode.outerHTML;
  else document.body.innerHTML = document.querySelector('#root').outerHTML;
}

function setLiveEdit(story, context, source, locationsMap, sourcePresets) {
  const channel = addons.getChannel();
  if (!removeLiveEditorDefined) {
    channel.on(coreEvents.SET_CURRENT_STORY, changeLiveEditor);
    removeLiveEditorDefined = true;
  }
  const currentLocation = getLocation(context, locationsMap);
  const {
    startLoc: { col: startLocCol, line: startLocLine },
    endLoc: { col: endLocCol, line: endLocLine },
  } = currentLocation;

  const linesOfCode = source.split('\n').slice(startLocLine - 1, endLocLine);
  const slicedCode =
    linesOfCode.length === 1
      ? [linesOfCode[0].substring(startLocCol, endLocCol)]
      : [
          linesOfCode[0].substring(startLocCol),
          ...linesOfCode.slice(1, -1),
          linesOfCode[linesOfCode.length - 1].substring(0, endLocCol),
        ];
  const rawSnippetWithTitle = slicedCode.join('\n');
  const rawSnippet = rawSnippetWithTitle.substring(rawSnippetWithTitle.indexOf(',') + 1);

  if (!rawSnippet.includes('withEnabledLiveEdit')) {
    return story(context);
  }
  const snippet = rawSnippet.replace('withEnabledLiveEdit', '');

  channel.emit(EVENT_ID, {
    source,
    currentLocation,
    locationsMap,
  });

  const recompile = newSnippet => {
    try {
      return transform(newSnippet, { presets: sourcePresets });
    } catch (e) {
      return () => e;
    }
  };

  const result = story(context);
  document.querySelectorAll('body > div#root').forEach(div => div.removeAttribute('id'));

  return (
    <LiveEdit initialSnippet={snippet} recompile={recompile} render={render} content={result} />
  );
}

export function withLiveEdit(source, locationsMap = {}, sourcePresets) {
  return (story, context) => setLiveEdit(story, context, source, locationsMap, sourcePresets);
}

// empty shell, will not be used but only read
export const withEnabledLiveEdit = story => story;
