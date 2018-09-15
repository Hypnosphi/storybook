import { document } from 'global';
import { stripIndents } from 'common-tags';
import { unregister } from 'riot';
import reactDom from 'react-dom';
import { render as renderRiot } from './render-riot';

export default function renderMain({
  story,
  selectedKind,
  selectedStory,
  showMain = () => {},
  showError = () => {},
}) {
  showMain();
  unregister('#root');
  const rootElement = document.getElementById('root');
  rootElement.innerHTML = '';
  rootElement.dataset.is = 'root';
  const component = story();
  if (
    component &&
    component.$$typeof &&
    component.$$typeof.toString() === 'Symbol(react.element)'
  ) {
    rootElement.removeAttribute('id');
    delete rootElement.dataset.is;
    reactDom.render(component, rootElement);
    document.getElementById('root').dataset.is = 'root';
    return component;
  }
  const rendered = renderRiot(component);
  if (!rendered)
    showError({
      title: `Expecting a riot snippet or a riot component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the component snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  return rendered;
}
