import AbstractView from './abstract.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { MAX_DESCRIPTION_LENGTH } from '../const.js';

const createFilmCardTemplate = (film) => {
  const { filmInfo, userDetails, comments } = film;

  const isWatchList = userDetails.watchlist ? 'film-card__controls-item--active' : '';
  const isWatched = userDetails.alreadyWatched ? 'film-card__controls-item--active' : '';
  const isFavorite = userDetails.favorite ? 'film-card__controls-item--active' : '';
  const runTime = filmInfo.runtime ? dayjs.duration(filmInfo.runtime, 'minutes').format('H[h] mm[m]') : '';
  const releaseDate = filmInfo.release.date ? dayjs(filmInfo.release.date).format('YYYY') : '';
  const genre = filmInfo.genre.length ? filmInfo.genre.join(', ') : '';
  const description = filmInfo.description.length <= 0 ? '' : filmInfo.description.length > MAX_DESCRIPTION_LENGTH ? filmInfo.description.substring(0, 139) + '...' : filmInfo.description;

  return `<article class="film-card" data-card-id="${film.id}">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${runTime}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchList}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openPopUpClickHandler = this._openPopUpClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openPopUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  setOpenPopUpClickHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopUpClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopUpClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopUpClickHandler);
  }
}
