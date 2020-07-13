/*************************
 *      HELPERS          *
 *************************/

// Calculate % of watched series / favorite items

const calculatePerctTotalSeries = (array) => {
  const totalNumber = 49146;
  const watchedNumber = array.length;
  const result = (watchedNumber * 100) / totalNumber;
  return result.toFixed(2); // show only 2 decimals
};

// check if there is image (if not, replace)

function checkImage(result) {
  if (!result.image) {
    const avatar = JSON.parse(localStorage.getItem('userDataLog')).avatar;
    // show sad version of user's avatar instead of cover
    result.image = avatar.replace(
      'smile',
      'concerned&options[style]=circle&options[eyes][]=surprised&options[b]=%23900'
    );
  } else {
    result.image = result.image.medium;
  }
}

// get id of a clicked item

const getClickedMediaId = (ev) => {
  return ev.target.dataset.id;
};

// tells if an item is in a list

const isMediaInList = (id, list) => {
  return !!list.find((element) => element === id);
};

// filters by genre

const filterByGenres = (e) => {
  section = 'Series'; // changes current section active to 'Series'
  const genreText = document.querySelector('.value.js-filter-genre');
  const genre = e.target.dataset.genre;
  genreText.innerHTML = genre;
  let genreSelection = [];
  let mediaSelection = [];
  let idSelection = [];
  getApiSeriesByGenre(genre).then((data) => {
    // add results from local api (genres) to array genreSelection
    for (const item of data) {
      genreSelection.push(item);
    }
    // looks for results in genreSelection that match the genre specified
    for (const item of genreSelection) {
      if (item['genre'].findIndex((element) => element === genre) !== -1) {
        idSelection.push(item.id);
      }
    }
    // gets info from selected ids from server
    for (let i = 0; i < 20; i++) {
      getApiSeriesById(idSelection[i]).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data); // only adds if status is not 404
          checkImage(data);
          checkRating(data);
        }
        paintSelection(mediaSelection);
        listenMakeFavoriteHeart();
        listenMakeWatchedEye();
        // Apply classes to heart & eye btns
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );
      });
    }
  });
};

// generate a random number

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

// apply class if element is in a list
const applyClassIfInList = (selector, list, classToApply) => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    const id = element.dataset.id;
    if (isMediaInList(id, list)) {
      element.classList.add(classToApply);
    }
  }
};
