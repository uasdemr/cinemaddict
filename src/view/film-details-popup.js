import AbstractView from './abstract.js';
import dayjs from 'dayjs';
import { EMOTIONS } from '../const.js';
import { mockComments } from '../mock/comments.js';
import { remove } from '../utils/render.js';

const createEmojiImg = (emoji) => {
  return emoji !== '' ? `<img src="./images/emoji/${emoji}.png" width="55" height="55">` : '';
};

const createEmojiList = () => {
  return EMOTIONS.map((emotion) => {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`;
  }).join('');
};

const createFilmDetailsTemplate = (data, state) => {
  const { filmInfo, filmComments, isToWathcList, isAsWatched, isToFavorite } = data;
  const { description, emoji } = state;

  const isWatchList = isToWathcList ? 'checked' : '';
  const isWatched = isAsWatched ? 'checked' : '';
  const isFavorite = isToFavorite ? 'checked' : '';

  const writers = filmInfo.writers.length > 0 ? filmInfo.writers.join(', ') : '';
  const actors = filmInfo.actors.length > 0 ? filmInfo.actors.join(', ') : '';
  const releaseDate = filmInfo.release.date ? dayjs(filmInfo.release.date).format('DD MMMM YYYY') : '';
  const runTime = filmInfo.runtime ? dayjs.duration(filmInfo.runtime, 'minutes').format('H[h] mm[m]') : '';
  const isPluralGenre = filmInfo.genre.length > 1 ? 'Genres' : 'Genre';

  const createFilmDetailsGenre = (genres) => {
    return genres.map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    }).join('');
  };

  const createFilmComments = (comments) => {
    const filteredComments = mockComments.filter(({ id }) => comments.includes(id));
    return filteredComments.map((item) => {
      const commentDate = item.date ? dayjs(item.date).format('YYYY/MM/DD HH:mm') : '';
      return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${createEmojiImg(item.emotion)}
      </span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" data-comment-id="${item.id}">Delete</button>
        </p>
      </div>
    </li>`;
    }).join('');
  };

  return `<section class="film-details" data-card-id="${data.id}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runTime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${isPluralGenre}</td>
              <td class="film-details__cell">
                ${createFilmDetailsGenre(filmInfo.genre)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createFilmComments(filmComments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${createEmojiImg(emoji)}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${description}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmojiList()}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

//Перенести в класс обработчики добавления комментариев, удаления комментариев
//добавление эмоции (клик по смайлику) из presenter/film.js
export default class FilmDetailPopup extends AbstractView {
  constructor(film) {
    super();
    // this._film = film;
    this._data = FilmDetailPopup.parseFilmToData(film);
    this._state = {
      description: '',
      emoji: '',
    };

    this._closePopUpClickHandler = this._closePopUpClickHandler.bind(this);
    this._formCommentDeleteClick = this._formCommentDeleteClick.bind(this);
    this._formTextAreaHandler = this._formTextAreaHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._asWatchedClickHandler = this._asWatchedClickHandler.bind(this);
    this._toWatchListClickHandler = this._toWatchListClickHandler.bind(this);

    this._handleFormCommentDelete = this._handleFormCommentDelete.bind(this);
    this._handleFormTextAreaSubmit = this._handleFormTextAreaSubmit.bind(this);
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentClera = this._commentClera.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._state);
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((item) => {
      item.addEventListener('click', this._handleFormCommentDelete);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._handleFormTextAreaSubmit);
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((item) => {
      item.addEventListener('change', this._handleEmojiClick);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _handleEmojiClick(evt) {
    const emojiReaction = evt.target.id.split('-')[1];
    this._state.emoji = emojiReaction;

    const img = document.createElement('img');
    img.src = `./images/emoji/${emojiReaction}.png`;
    img.alt = `emoji-${emojiReaction}`;
    img.width = 55;
    img.height = 55;
    img.id = emojiReaction;

    const imgContainer = this.getElement().querySelector('.film-details__add-emoji-label');
    const oldImg = imgContainer.querySelector('img');
    if (oldImg) {
      oldImg.remove();
    }
    imgContainer.appendChild(img);

    const emoji = this._state.emoji;
    this.updateData({
      emoji: emoji ? emoji : '',
    }, true);
  }

  _handleFormCommentDelete(evt) {
    const { filmComments } = this._data;
    const emoji = this._state.emoji;

    filmComments.splice(filmComments.indexOf(evt.target.dataset.commentId), 1);
    this.updateData({
      filmComments,
      emoji: emoji ? emoji : '',
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this._state.description = evt.target.value;
  }

  _commentClera() {
    this._state = {
      emoji: '',
      description: '',
    };
    this.updateElement();
  }

  _handleFormTextAreaSubmit(evt) {
    const { filmComments } = this._data;

    if (evt.code == 'Enter' && evt.ctrlKey) {
      const updatedObj = {};

      const allComments = mockComments;
      const newCommentId = String(allComments[allComments.length - 1].id * 1 + 1);

      const newComment = {
        id: newCommentId,
        author: 'Ivan Pirogov',
        comment: evt.target.value,
        date: Date.now(),
        emotion: this._state.emoji ? this._state.emoji : '',
      };
      allComments.push(newComment);
      filmComments.push(newCommentId);
      updatedObj.filmComments = filmComments;
      this.updateData(updatedObj);
      this._commentClera();
    }
  }

  _closePopUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _formCommentDeleteClick(evt) {
    evt.preventDefault();
    this._callback.formCommentDelete(evt, this._film);
  }

  _formTextAreaHandler(evt) {
    this._callback.formTextAreaKeyDown(evt, this._film);
  }

  _favoriteClickHandler(evt) {
    // evt.preventDefault();
    this._callback.favoriteClick();
  }

  _asWatchedClickHandler(evt) {
    // evt.preventDefault();
    this._callback.asWatchedClick();
  }

  _toWatchListClickHandler(evt) {
    // evt.preventDefault();
    this._callback.watchListClick();
  }

  setClosePopUpClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopUpClickHandler);
  }

  setFormCommentDeleteClickHandler(callback) {
    this._callback.formCommentDelete = callback;
    const commentDeleteButton = this.getElement().querySelectorAll('.film-details__comment-delete');
    for (const button of commentDeleteButton) {
      button.addEventListener('click', this._formCommentDeleteClick);
    }
  }

  setFormTextAreaKeyDownHandler(callback) {
    this._callback.formTextAreaKeyDown = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._formTextAreaHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setAsWatchedClickHandler(callback) {
    this._callback.asWatchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._asWatchedClickHandler);
  }

  setToWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._toWatchListClickHandler);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        isToWathcList: film.userDetails.watchlist,
        isAsWatched: film.userDetails.alreadyWatched,
        isToFavorite: film.userDetails.favorite,
        filmComments: film.comments,
      },
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    delete data.isToWathcList;
    delete data.isAsWatched;
    delete data.isToFavorite;
    delete data.filmComments;

    return data;
  }
}
