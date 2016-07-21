import View from '../base/view';
import LocationChooser from '../views/location-chooser';
import Search from '../views/search';

import {toggle, show, bigLoader} from '../utils';


export default class MainView extends View {
  constructor({app, state}) {
    super({app});

    this.state = state;

    this.locationChooser = new LocationChooser({
      app,
      route: state.route,
      location: state.location
    });

    this.search = new Search({
      app,
      isOnSearchPage: state.route.name == 'search',
      query: state.route.name == 'search' ? state.query.q : ''
    });
  }

  mount() {
    const container = document.querySelector('#view-container');
    const city = document.querySelector('#city');
    const search = document.querySelector('#search');
    const loader = document.querySelector('#view-loader-container');

    this.locationChooser.renderInto(city);
    this.search.renderInto(search);
    document.title = this.getTitle();

    toggle(loader, this.state.isWaiting);
    show(city);
    show(search);

    const previousElement = this.findViewElement(container);
    const newElement = this.state.element;
    if (previousElement != newElement) {
      if (previousElement) {
        container.replaceChild(newElement, previousElement);
      } else {
        container.appendChild(newElement);
      }
    }

    // this, for reasons unknown to me, makes Chrome and FF correctly
    // remember scroll positions when switching views
    window.scrollTo(window.scrollX, window.scrollY);
  }

  getTitle() {
    if (this.state.page) {
      return `${this.state.page.getTitle()} – Theatrics`;
    } else {
      return 'Theatrics';
    }
  }

  findViewElement(container) {
    return Array.from(container.children).find(node => node.id != 'view-loader-container');
  }
}
