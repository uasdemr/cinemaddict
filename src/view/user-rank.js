import { createElement } from '../utils.js';

const getWhoAmI = (films) => {
  const alreadyWatchedCount = films.filter((item) => item.userDetails.alreadyWatched).length;
  return alreadyWatchedCount >= 21
    ? 'Movie Buff' : alreadyWatchedCount > 10 && alreadyWatchedCount <= 20
      ? 'Fan' : alreadyWatchedCount >= 1 && alreadyWatchedCount <= 10
        ? 'Novice' : '';
};

const createUserRankTemplate = (films) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${getWhoAmI(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
  constructor(films) {
    this._films = films;

    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
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
