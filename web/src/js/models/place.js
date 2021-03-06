import escape from 'lodash.escape';

import {locations} from '../core/data';

import {capfirst} from '../utils/strings';
import {makeAbsoluteURL} from '../utils/urls';


export default class Place {
  constructor(data) {
    this.data = data;
  }

  isStub() {
    return this.data.is_stub;
  }

  isReference() {
    return typeof this.data == 'number';
  }

  getHighlightedName() {
    if (!this.data.highlight) return this.getName();
    return (
      capfirst(this.data.highlight.full_name) ||
      this.data.highlight.name ||
      escape(this.getName())
    );
  }

  getName() {
    return capfirst(this.data.full_name);
  }

  getPresentFields(...fields) {
    return fields.filter(f => this.hasValue(f));
  }

  hasValue(field) {
    const value = this.data[field];
    const isDefined = value != null;
    const hasLength = isDefined && value.hasOwnProperty('length');
    return hasLength ? value.length > 0 : isDefined;
  }

  getLocation() {
    return locations.get(this.data.location);
  }

  toJSONLD(app) {
    const url = app.url('place', {id: this.data.id});

    if (this.isReference()) {
      return {
        '@id': url,
      }
    }

    const result = {
      '@context': 'http://schema.org',
      '@type': 'Place',
      '@id': url,
      name: this.getName(),
      address: this.data.address,
    }

    if (!this.isStub()) {
      result.url = makeAbsoluteURL(url);
    }

    if (this.data.url) {
      result.sameAs = this.data.url;
    }

    return result;
  }
}
