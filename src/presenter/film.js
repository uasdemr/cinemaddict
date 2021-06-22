import FilmCardView from '../view/film-card.js';
import FilmDetailPopup from '../view/film-details-popup.js';

import { render, remove, RenderPosition } from '../utils/render.js';

export default class Film {
  constructor(filmListContainerElement) {
    this._filmListContainerElement = filmListContainerElement;

    this._filmComponent = null;
    this._filmDetailPopUpComponent = null;

    this._openFilmCardPopUpHandler = this._openFilmCardPopUpHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeFilmCardPopUpHandler = this._closeFilmCardPopUpHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmComponent = new FilmCardView(this._film);
    this._filmDetailPopUpComponent = new FilmDetailPopup(this._film);

    this._filmComponent.setOpenPopUpClickHandler(this._openFilmCardPopUpHandler);


    render(this._filmListContainerElement, this._filmComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _openFilmCardPopUpHandler() {
    // const cardId = evt.target.parentElement.dataset.cardId;
    // const findedFilm = this._boardFilms.find((film) => film.id === cardId);

    document.body.appendChild(this._filmDetailPopUpComponent.getElement());
    document.body.classList.add('hide-overflow');

    this._filmDetailPopUpComponent.setClosePopUpClickHandler(() => {
      this._closeFilmCardPopUpHandler(this._filmDetailPopUpComponent);
    });

    document.body.addEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmCardPopUpHandler(this._filmDetailPopUpComponent);
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _closeFilmCardPopUpHandler(filmPopUpElement) {
    remove(filmPopUpElement);

    document.body.classList.remove('hide-overflow');
    document.body.removeEventListener('keydown', this._escKeyDownHandler);
  }


}
