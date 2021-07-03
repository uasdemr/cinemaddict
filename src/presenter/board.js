import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';
import NoFilmsView from '../view/no-films.js';
import FilmPresenter from './film.js';

import { updateItem } from '../utils/common.js';
import { render, remove, RenderPosition } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { SortType } from '../const.js';
import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from '../const.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._noFilmComponent = new NoFilmsView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._boardFilms = boardFilms.slice();

    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedBoardFilms = boardFilms.slice();

    render(this._boardContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    // - Очищаем список
    // - Рендерим список заново
    this._clearFilmList();
    this._renderFilmList();
  }

  _sortFilms(sortType) {
    console.log(sortType);
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardFilms
    switch (sortType) {
      case SortType.BY_DATE.toLowerCase():
        this._boardFilms.sort(sortByDate);
        break;
      case SortType.BY_RATING.toLowerCase():
        this._boardFilms.sort(sortByRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardFilms исходный массив
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmListContainerElement, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
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

    if (this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
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
