import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import FilmDetailPopup from '../view/film-details-popup.js';
import NoFilmsView from '../view/no-films.js';

import { render, remove, RenderPosition } from '../utils/render.js';

import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from '../const.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._noFilmComponent = new NoFilmsView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    
    render(this._boardContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(film) {
    // Метод, куда уйдёт логика по созданию и рендерингу компонетов фильма,
    // текущая функция renderFilm в main.js
    const filmCardComponent = new FilmCardView(film);
    let filmPopUpElement = null;

    const openFilmCardPopUp = (evt) => {
      const cardId = evt.target.parentElement.dataset.cardId;
      const findedFilm = this._boardFilms.find((film) => film.id === cardId);

      filmPopUpElement = new FilmDetailPopup(findedFilm);

      document.body.appendChild(filmPopUpElement.getElement());
      document.body.classList.add('hide-overflow');

      filmPopUpElement.setClosePopUpClickHandler(() => {
        closeFilmCardPopUp(filmPopUpElement);
      });

      document.body.addEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmCardPopUp(filmPopUpElement);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const closeFilmCardPopUp = (filmPopUpElement) => {
      remove(filmPopUpElement);

      document.body.classList.remove('hide-overflow');
      document.body.removeEventListener('keydown', onEscKeyDown);
    };


    filmCardComponent.setOpenPopUpClickHandler((evt) => {
      openFilmCardPopUp(evt);
    });

    render(this._filmListContainerElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderFilms(from, to) {
    // Метод для рендеринга N-фильмов за раз
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm));
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
    render(this._filmsComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if(this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent)
    }
  }

  _renderShowMoreButton() {
    // Метод, куда уйдёт логика по отрисовке компонетов фильмов,
    // текущая функция renderFilm в main.js
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    // showMoreButtonComponent.setClickHandler(() => {
    //   this._boardFilms
    //     .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
    //     .forEach((film) => this._renderFilm(film));

    //   renderedFilmCount += FILM_COUNT_PER_STEP;

    //   if (renderedFilmCount >= this._boardFilms.length) {
    //     remove(showMoreButtonComponent);
    //   }
    // });

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmList() {
    this._renderFilms(0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRated() {
    // Блок «Top rated movies» не отображается, если у всех фильмов рейтинг равен нулю.
    render(this._filmsComponent, new TopRatedView().getElement(), RenderPosition.BEFOREEND);
  }

  _renderMostCommented() {
    // Блок «Most commented» не отображается, если отсутствуют фильмы с комментариями.
  }

  _renderBoard() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if (this._boardFilms <= 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    this._renderFilmList();
  }
}