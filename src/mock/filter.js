const filmsToFilterMap = {
  'All movies': (films) => films.length,
  'Watchlist': (films) => films.filter((film) => film.userDetails.watchlist).length,
  'History': (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  'Favorites': (films) => films.filter((film) => film.userDetails.favorite).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
