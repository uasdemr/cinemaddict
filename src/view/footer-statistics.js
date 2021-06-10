import { createElement } from '../utils.js';

const createFooterStatisticsTemplate = (filmsLength) => {
  const moviesInside = filmsLength ? filmsLength : '0';
  return `<p>
    ${moviesInside} movies inside
  </p>`;
};

export default class FooterStatistics {
  constructor(filmsLength) {
    this._filmsLength = filmsLength;

    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsLength);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
