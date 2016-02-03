export default class TheatricsAPI {
  constructor(prefix, fetch) {
    this.prefix = prefix;
    this.fetch = fetch;
  }

  fetchEvent(id) {
    return this.get(`/events/${id}/`, {expand: 'place,images'});
  }

  fetchPlace(id) {
    return this.get(`/places/${id}/`, {expand: 'images'});
  }

  get(path, params) {
    const url = this.buildURL(path);
    const query = this.serializeParams(params);
    const fullURL = query ? `${url}?${query}` : url;
    return this.fetch(fullURL).then(response => response.json());
  }

  buildURL(path) {
    if (path.slice(0, 7) == 'http://') {
      return path;
    } else {
      return this.prefix + path;
    }
  }

  serializeParams(params) {
    if (params) {
      return Object
        .keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    } else {
      return null;
    }
  }
}