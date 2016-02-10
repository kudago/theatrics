import View from '../base/view';


export default class NotFound extends View {
  getHTML() {
    return `
      <div class="not-found-view">
        <div class="not-found-message">
          <h2>
            404 <span class="tagline">Здесь нет такой страницы</span>
          </h2>
          <p>
            Но вообще есть замечательные <a href="/">спектакли</a>
          </p>
        </div>
      </div>
    `;
  }

  mount() {
    this.app.setTitle("404");
  }
}
