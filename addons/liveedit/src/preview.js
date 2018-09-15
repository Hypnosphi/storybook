import React from 'react';
import addons from '@storybook/addons';
import { transform } from '@babel/standalone';
import { EVENT_ID } from './events';
import LiveEdit from './LiveEdit';

function getLocation(context, locationsMap) {
  return locationsMap[`${context.kind}@${context.story}`] || locationsMap[`@${context.story}`];
}

function setLiveEdit(story, context, source, locationsMap, sourcePresets) {
  const channel = addons.getChannel();
  const currentLocation = getLocation(context, locationsMap);
  const {
    startLoc: { col: startLocCol, line: startLocLine },
    endLoc: { col: endLocCol, line: endLocLine },
  } = currentLocation;

  const linesOfCode = source.split('\n').slice(startLocLine - 1, endLocLine);
  const slicedCode = [
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

  return (
    <LiveEdit initialSnippet={snippet} recompile={recompile}>
      {story(context)}
    </LiveEdit>
  );
}

export function withLiveEdit(source, locationsMap = {}, sourcePresets) {
  return (story, context) => setLiveEdit(story, context, source, locationsMap, sourcePresets);
}

// empty shell, will not be used but only read
export const withEnabledLiveEdit = story => story;
