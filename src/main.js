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

import { films } from './mock/films.js';
import { generateFilter } from './mock/filter.js';
films.length = 30;
import { FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, FILM_COUNT_PER_STEP } from './const.js';

const filters = generateFilter(films);
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');


render(siteHeaderElement, createUserRankTemplate(films), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(filters), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmListElement = siteMainElement.querySelector('.films-list');
const filmListContainerElement = siteMainElement.querySelector('div.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmListContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmListElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmListContainerElement, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if(renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const filmsElement = siteMainElement.querySelector('.films');
render(filmsElement, createTopRatedTemplate(), 'beforeend');
const filmListTopRatedElement = filmsElement.querySelector('.films-list--extra .films-list__container');
for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
  render(filmListTopRatedElement, createFilmCardTemplate(films[i]), 'beforeend');
}

render(filmsElement, createMostCommentedTemplate(), 'beforeend');
const filmMostComentedElement = filmsElement.querySelectorAll('.films-list--extra .films-list__container')[1];
for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
  render(filmMostComentedElement, createFilmCardTemplate(films[i]), 'beforeend');
}

render(footerStatisticsElement, createFooterStatisticsTemplate(films.length), 'beforeend');
render(document.body, createFilmDetailsTemplate(films[0]), 'beforeend');
