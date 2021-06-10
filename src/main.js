import UserRankView from './view/user-rank.js';
import FilterView from './view/main-navigation.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import createShowMoreButtonView from './view/show-more-button.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import FooterStatisticsView from './view/footer-statistics';
import FilmDetailPopup from './view/film-details-popup.js';

import { render, RenderPosition } from './utils.js';

import { films } from './mock/films.js';
import { generateFilter } from './mock/filter.js';
import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from './const.js';

films.length = 30;

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, new UserRankView(films).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsView().getElement();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);
render(filmsComponent, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

const filmListElement = siteMainElement.querySelector('.films-list');
const filmListContainerElement = siteMainElement.querySelector('div.films-list__container');

const openFilmCardPopUp = (findedFilm) => {
  const filmPopUpElement = new FilmDetailPopup(findedFilm).getElement();
  document.body.appendChild(filmPopUpElement);
  document.body.classList.add('hide-overflow');
  filmPopUpElement.querySelector('.film-details__close-btn').addEventListener('click', closeFilmCardPopUp);

  document.body.addEventListener('keydown', escKeyDown);
};

const escKeyDown = (evt) => {
  if (evt.code === 'Escape') {
    closeFilmCardPopUp();
  }
};

const closeFilmCardPopUp = () => {
  const openerPopUp = document.body.querySelector('.film-details');
  document.body.removeChild(openerPopUp);
  document.body.classList.remove('hide-overflow');
  document.body.removeEventListener('keydown', escKeyDown);
};

const renderFilm = (filmListContainerElement, film) => {
  const filmCardElement = new FilmCardView(film).getElement();

  render(filmListContainerElement, filmCardElement, RenderPosition.BEFOREEND);

  filmCardElement.querySelector('.film-card__poster').addEventListener('click', (evt) => {
    const cardId = evt.target.parentElement.dataset.cardId;
    const findedFilm = films.find((film) => film.id === cardId);
    openFilmCardPopUp(findedFilm);
  });
  filmCardElement.querySelector('.film-card__title').addEventListener('click', (evt) => {
    const cardId = evt.target.parentElement.dataset.cardId;
    const findedFilm = films.find((film) => film.id === cardId);
    openFilmCardPopUp(findedFilm);
  });
  filmCardElement.querySelector('.film-card__comments').addEventListener('click', (evt) => {
    const cardId = evt.target.parentElement.dataset.cardId;
    const findedFilm = films.find((film) => film.id === cardId);
    openFilmCardPopUp(findedFilm);
  });


};

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(filmListContainerElement, films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmListElement, new createShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmListContainerElement, film, RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(filmsComponent, new TopRatedView().getElement(), RenderPosition.BEFOREEND);
const topRatedElement = filmsComponent.querySelector('.films-list--extra .films-list__container');
for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
  renderFilm(topRatedElement, films[i], RenderPosition.BEFOREEND);
}

render(filmsComponent, new MostCommentedView().getElement(), RenderPosition.BEFOREEND);
const filmMostComentedElement = filmsComponent.querySelectorAll('.films-list--extra .films-list__container')[1];
for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
  renderFilm(filmMostComentedElement, films[i], RenderPosition.BEFOREEND);
}

render(footerStatisticsElement, new FooterStatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);
// render(document.body, new FilmDetailPopup(films[0]).getElement(), RenderPosition.BEFOREEND);
