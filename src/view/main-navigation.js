const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;
  return `<a href="#${String(name.toLowerCase()).split(' ')[0]}" class="main-navigation__item
    ${isActive ? 'main-navigation__item--active' : ''}">
    ${name === 'All movies' ? 'All movies' : `${name}<span class="main-navigation__item-count">${count}</span>`}
  </a>`;
};

export const createMainNavigationTemplate = (filters) => {
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
