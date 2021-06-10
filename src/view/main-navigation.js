import {createElement} from '../utils.js';

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;
  return `<a href="#${String(name.toLowerCase()).split(' ')[0]}" class="main-navigation__item
    ${isActive ? 'main-navigation__item--active' : ''}">
    ${name === 'All movies' ? 'All movies' : `${name} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
};

const createMainNavigationTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
