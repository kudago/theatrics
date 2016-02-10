import moment from 'moment';

import View from '../base/view';
import Feed from '../models/feed';
import {capfirst} from '../utils';

import Calendar from '../views/calendar';
import FeedView from '../views/feed-view';

import itemTemplate from '../../templates/feed-event.ejs';


export default class EventListPageView extends View {
  constructor({app, model}) {
    super({app, model});

    this.feed = new Feed(
      '/events/', {
        categories: 'theater,-kids',
        fields: 'place,images,tagline,id,title,short_title,categories,description',
        expand: 'place,images',
        page_size: 24,
      });

    this.calendar = new Calendar({app, model});
    this.feedView = new FeedView({app, itemTemplate, model: this.feed});
  }

  getHTML() {
    return `
      <div class="events-view content-container unconstrained">
        ${this.calendar.getHTML()}
        ${this.feedView.getHTML()}
      </div>
    `
  }

  mount(element) {
    this.calendar.mount(element.querySelector('.calendar-container'));
    this.feedView.mount(element.querySelector('.feed-container'));

    this.model.on('change', () => this.update())
    this.update();
  }

  update() {
    this.updateFeedQuery();
    this.updateTitle();
    this.updateLocationSetting();
  }

  updateFeedQuery() {
    const location = this.app.locations.get(this.model.get('location'));
    const query = this.feed.query;

    query.lock();

    query.set('location', location.slug);

    const date = this.model.get('date');
    if (date) {
      const day = moment.tz(date, location.timezone);
      query.set('actual_since', day.unix());
      query.set('actual_until', day.clone().add(1, 'days').unix());
    } else {
      query.set('actual_since', moment().unix());
      query.remove('actual_until');
    }

    query.apply();
  }

  updateTitle() {
    const state = this.model.data;
    const location = this.app.locations.get(state.location);
    const date = state.date ? moment(state.date).format('D MMMM') : null;
    if (date) {
      this.app.setTitle(`${date} – Спектакли – ${location.name}`);
    } else {
      this.app.setTitle(`Спектакли – ${location.name}`);
    }
  }

  updateLocationSetting() {
    this.app.settings.set('location', this.model.get('location'));
  }
}
