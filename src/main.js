import UserRankView from './view/user-rank.js';
import FilterView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics';
import BoardPresenter from './presenter/board.js';

import { render, RenderPosition } from './utils/render.js';

import { films } from './mock/films.js';
import { generateFilter } from './mock/filter.js';

films.length = 30;

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(films).getElement(), RenderPosition.BEFOREEND);
boardPresenter.init(films);
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.AFTERBEGIN);

render(footerStatisticsElement, new FooterStatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);
