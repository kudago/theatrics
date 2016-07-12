import View from '../base/view';

import {addClass, trigger} from '../utils';

import template from '../../templates/search.ejs';


export default class Search extends View {
  constructor({app, route, query}) {
    super({app});
    this.route = route;
    this.query = query;
  }

  getHTML() {
    return this.app.renderTemplate(template, {query: this.query});
  }

  mount(element) {
    this.element = element;
    this.input = element.querySelector('input');

    const onType = this.onType.bind(this);
    const onSubmit = this.onSubmit.bind(this);

    this.element.addEventListener('submit', onSubmit);
    this.input.addEventListener('keyup', onType);
    this.input.addEventListener('input', onType);
  }

  onType(event) {
    if (this.typeTimeout) window.clearTimeout(this.typeTimeout);
    this.typeTimeout = window.setTimeout(() => {
      const action = this.route.name == 'search' ? 'redirect' : 'navigate';
      const url = this.getSearchPageURL();
      trigger(window, action, url);
    }, 100);
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.typeTimeout) window.clearTimeout(this.typeTimeout);
    const url = this.getSearchPageURL();
    trigger(window, 'navigate', url);
  }

  getSearchPageURL() {
    const query = this.input.value;
    const path = this.app.url('search', {});
    return `${path}?q=${encodeURIComponent(query)}`;
  }
}
