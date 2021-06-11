import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (filmsLength) => {
  const moviesInside = filmsLength ? filmsLength : '0';
  return `<p>
    ${moviesInside} movies inside
  </p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(filmsLength) {
    super();
    this._filmsLength = filmsLength;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsLength);
  }
}
