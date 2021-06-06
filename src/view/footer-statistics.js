export const createFooterStatisticsTemplate = (filmsLength) => {
  const moviesInside = filmsLength ? filmsLength : '';
  return `<p>
    ${moviesInside} movies inside
  </p>`;
};
