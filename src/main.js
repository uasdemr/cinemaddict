import { createUserRankTemplate } from './view/user-rank.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createTopRatedTemplate } from './view/top-rated.js';
import { createMostCommentedTemplate } from './view/most-commented.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics';
import { createFilmDetailsTemplate } from './view/film-details-popup.js';

const FILM_COUNT = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');


render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmListElement = siteMainElement.querySelector('.films-list');
const filmListContainerElement = siteMainElement.querySelector('div.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(filmListElement, createShowMoreButtonTemplate(), 'beforeend');

const filmsElement = siteMainElement.querySelector('.films');
render(filmsElement, createTopRatedTemplate(), 'beforeend');
const filmListTopRatedElement = filmsElement.querySelector('.films-list--extra .films-list__container');
for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
  render(filmListTopRatedElement, createFilmCardTemplate(), 'beforeend');
}

render(filmsElement, createMostCommentedTemplate(), 'beforeend');
const filmMostComentedElement = filmsElement.querySelectorAll('.films-list--extra .films-list__container')[1];
for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
  render(filmMostComentedElement, createFilmCardTemplate(), 'beforeend');
}

render(footerStatisticsElement, createFooterStatisticsTemplate(), 'beforeend');
// render(document.body, createFilmDetailsTemplate(), 'beforeend');

