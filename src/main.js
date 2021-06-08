import { createUserRankTemplate } from './view/user-rank.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import createShowMoreButtonView from './view/show-more-button.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics';
import { createFilmDetailsTemplate } from './view/film-details-popup.js';

import {renderTemplate, renderElement, RenderPosition} from './utils.js';

import { films } from './mock/films.js';
import { generateFilter } from './mock/filter.js';
import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from './const.js';

films.length = 30;

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createUserRankTemplate(films), 'beforeend');
renderTemplate(siteMainElement, createMainNavigationTemplate(filters), 'beforeend');
renderElement(siteMainElement, new SortView().getElement(), 'beforeend');

const filmsElement = new FilmsView().getElement();
renderElement(siteMainElement, filmsElement, RenderPosition.BEFOREEND);
renderElement(filmsElement, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

const filmListElement = siteMainElement.querySelector('.films-list');
const filmListContainerElement = siteMainElement.querySelector('div.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmListContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderElement(filmListElement, new createShowMoreButtonView().getElement(), 'beforeend');

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmListContainerElement, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if(renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// const filmsElement = siteMainElement.querySelector('.films');
renderElement(filmsElement, new TopRatedView().getElement(), 'beforeend');
const topRatedElement = filmsElement.querySelector('.films-list--extra .films-list__container');
for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
  renderTemplate(topRatedElement, createFilmCardTemplate(films[i]), 'beforeend');
}

renderElement(filmsElement, new MostCommentedView().getElement(), 'beforeend');
const filmMostComentedElement = filmsElement.querySelectorAll('.films-list--extra .films-list__container')[1];
for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
  renderTemplate(filmMostComentedElement, createFilmCardTemplate(films[i]), 'beforeend');
}

renderTemplate(footerStatisticsElement, createFooterStatisticsTemplate(films.length), 'beforeend');
// renderTemplate(document.body, createFilmDetailsTemplate(films[0]), 'beforeend');
