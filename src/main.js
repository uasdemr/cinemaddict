import UserRankView from './view/user-rank.js';
import FilterView from './view/main-navigation.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import FooterStatisticsView from './view/footer-statistics';
import FilmDetailPopup from './view/film-details-popup.js';
import NoFilms from './view/no-films.js';

import { render, RenderPosition, remove } from './utils/render.js';

import { films } from './mock/films.js';
import { generateFilter } from './mock/filter.js';
import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from './const.js';

films.length = 30;

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');


const renderFilm = (filmListContainerElement, film) => {
  const filmCardComponent = new FilmCardView(film);
  let filmPopUpElement = null;

  const openFilmCardPopUp = (evt) => {
    const cardId = evt.target.parentElement.dataset.cardId;
    const findedFilm = films.find((film) => film.id === cardId);

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

  render(filmListContainerElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const renderBoard = (siteHeaderElement, films) => {
  if (films.length > 0) {
    render(siteHeaderElement, new UserRankView(films).getElement(), RenderPosition.BEFOREEND);
    render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
    const filmsComponent = new FilmsView().getElement();
    render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);
    render(filmsComponent, new FilmsListView().getElement(), RenderPosition.BEFOREEND);
    const filmListElement = siteMainElement.querySelector('.films-list');
    const filmListContainerElement = siteMainElement.querySelector('div.films-list__container');
    for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
      renderFilm(filmListContainerElement, films[i]);
    }

    if (films.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;
      const showMoreButtonComponent = new ShowMoreButtonView();

      render(filmListElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);


      showMoreButtonComponent.setClickHandler(() => {
        films
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmListContainerElement, film, RenderPosition.BEFOREEND));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= films.length) {
          remove(showMoreButtonComponent);
        }
      });
    }

    render(filmsComponent, new TopRatedView().getElement(), RenderPosition.BEFOREEND);
    const topRatedElement = filmsComponent.querySelector('.films-list--extra .films-list__container');
    for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
      if (films[i] === undefined) {
        break;
      } else {
        renderFilm(topRatedElement, films[i], RenderPosition.BEFOREEND);
      }
    }

    render(filmsComponent, new MostCommentedView().getElement(), RenderPosition.BEFOREEND);
    const filmMostComentedElement = filmsComponent.querySelectorAll('.films-list--extra .films-list__container')[1];
    for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
      if (films[i] === undefined) {
        break;
      } else {
        renderFilm(filmMostComentedElement, films[i], RenderPosition.BEFOREEND);
      }
    }

  } else {
    render(siteMainElement, new NoFilms().getElement(), RenderPosition.BEFOREEND);
  }
};

renderBoard(siteHeaderElement, films);
render(footerStatisticsElement, new FooterStatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);
