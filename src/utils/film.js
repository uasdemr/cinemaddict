import dayjs from 'dayjs';

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.date, filmB.filmInfo.date);
  if (weight !== null) {
    return weight;
  }

  return dayjs(filmA.filmInfo.release.date).isBefore(dayjs(filmB.filmInfo.release.date));
};

export const sortByRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);

  if (weight !== null) {
    return weight;
  }

  return filmB.filmInfo.totalRating > filmA.filmInfo.totalRating;
};
