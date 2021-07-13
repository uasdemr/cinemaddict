import FilmCardView from '../view/film-card.js';
import FilmDetailPopup from '../view/film-details-popup.js';
import { mockComments } from '../mock/comments.js';

import { render, remove, RenderPosition, replace } from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  SHOWING: 'SHOWING',
};

export default class Film {
  constructor(filmListContainerElement, changeData, changeMode) {
    this._filmListContainerElement = filmListContainerElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmDetailPopUpComponent = null;
    this._mode = Mode.DEFAULT;

    this._openFilmCardPopUpHandler = this._openFilmCardPopUpHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeFilmCardPopUpHandler = this._closeFilmCardPopUpHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAsWatchedClick = this._handleAsWatchedClick.bind(this);
    this._handleToWatchListClick = this._handleToWatchListClick.bind(this);

    // this._handleFormCommentDelete = this._handleFormCommentDelete.bind(this);
    // this._handleFormTextAreaSubmit = this._handleFormTextAreaSubmit.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailPopUpComponent = this._filmDetailPopUpComponent;
    this._filmDetailPopUpComponent = new FilmDetailPopup(this._film);
    this._filmDetailPopUpComponentAddEventListener();
    // const prevFilmDetailPopUpComponent = this._filmDetailPopUpComponent;

    this._filmComponent = new FilmCardView(this._film);

    this._filmComponentAddEventListener();

    if (prevFilmComponent === null) {
      render(this._filmListContainerElement, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if (this._mode === Mode.SHOWING) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._filmDetailPopUpComponent, prevFilmDetailPopUpComponent);
      remove(prevFilmComponent);
      remove(prevFilmDetailPopUpComponent);
      // remove(prevFilmDetailPopUpComponent);
    }

    // remove(prevFilmComponent);
    // remove(prevFilmDetailPopUpComponent);
  }

  destroy() {
    remove(this._filmComponent);
    // remove(this._filmDetailPopUpComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailPopUpComponent);
    }
  }

  _filmDetailPopUpComponentAddEventListener() {
    this._filmDetailPopUpComponent.setClosePopUpClickHandler(this._closeFilmCardPopUpHandler);
    // this._filmDetailPopUpComponent.setFormCommentDeleteClickHandler(this._handleFormCommentDelete);
    // this._filmDetailPopUpComponent.setFormTextAreaKeyDownHandler(this._handleFormTextAreaSubmit);
    this._filmDetailPopUpComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailPopUpComponent.setAsWatchedClickHandler(this._handleAsWatchedClick);
    this._filmDetailPopUpComponent.setToWatchListClickHandler(this._handleToWatchListClick);
  }

  _filmComponentAddEventListener() {
    this._filmComponent.setOpenPopUpClickHandler(this._openFilmCardPopUpHandler);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setAsWatchedClickHandler(this._handleAsWatchedClick);
    this._filmComponent.setToWatchListClickHandler(this._handleToWatchListClick);
  }

  _openFilmCardPopUpHandler() {
    this._changeMode();
    const prevFilmDetailPopUpComponent = this._filmDetailPopUpComponent;
    this._filmDetailPopUpComponent = new FilmDetailPopup(this._film);
    this._filmDetailPopUpComponentAddEventListener();

    if (prevFilmDetailPopUpComponent !== null) {
      replace(this._filmDetailPopUpComponent, prevFilmDetailPopUpComponent);
      remove(prevFilmDetailPopUpComponent);
    }
    render(document.body, this._filmDetailPopUpComponent, RenderPosition.BEFOREEND);


    document.body.classList.add('hide-overflow');
    document.body.addEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.SHOWING;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmCardPopUpHandler();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _closeFilmCardPopUpHandler() {
    remove(this._filmDetailPopUpComponent);

    document.body.classList.remove('hide-overflow');
    document.body.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            favorite: !this._film.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleAsWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          // isFavorite: !this._task.isFavorite,
          userDetails: {
            ...this._film.userDetails,
            alreadyWatched: !this._film.userDetails.alreadyWatched,
          },
        },
      ),
    );
  }

  _handleToWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          // isFavorite: !this._task.isFavorite,
          userDetails: {
            ...this._film.userDetails,
            watchlist: !this._film.userDetails.watchlist,
          },
        },
      ),
    );
  }

  // _handleFormCommentDelete(evt, film) {
  //   const { comments } = film;
  //   comments.splice(comments.indexOf(evt.target.dataset.commentId), 1);
  //   this._changeData(
  //     Object.assign(
  //       {},
  //       this._film,
  //       {
  //         comments: comments,
  //       },
  //     ),
  //   );
  // }

  // _handleFormTextAreaSubmit(evt, film) {
  //   const { comments } = film;

  //   if (evt.code == 'Enter' && evt.ctrlKey) {
  //     const allComments = mockComments;
  //     const newCommentId = String(allComments[allComments.length - 1].id * 1 + 1);

  //     const newComment = {
  //       id: newCommentId,
  //       author: 'Ivan Pirogov',
  //       comment: evt.target.value,
  //       date: Date.now(),
  //       emotion: 'smile',
  //     };

  //     allComments.push(newComment);
  //     comments.push(newCommentId);
  //     this._changeData(
  //       Object.assign(
  //         {},
  //         this._film,
  //         {
  //           comments: comments,
  //         },
  //       ),
  //     );
  //   }
  // }
}
