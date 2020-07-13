/*************************
 *      HELPERS          *
 *************************/

// Calculate % of watched series / favorite items

const calculatePerctTotalSeries = (array) => {
  const totalNumber = 49146;
  const watchedNumber = array.length;
  const result = (watchedNumber * 100) / totalNumber;

  return result.toFixed(2);
};

// check if there is image (if not, replace)

function checkImage(result) {
  if (!result.image) {
    const avatar = JSON.parse(localStorage.getItem('userDataLog')).avatar;
    console.log(avatar);
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
  section = 'Series';
  const genreText = document.querySelector('.value.js-filter-genre');
  const genre = e.target.dataset.genre;
  console.log('Filter time ' + genre);
  genreText.innerHTML = genre;
  let genreSelection = [];
  let mediaSelection = [];
  let idSelection = [];
  getApiSeriesByGenre(genre).then((data) => {
    // Check by genre
    for (const item of data) {
      genreSelection.push(item);
    }
    console.log(genreSelection);
    for (const item of genreSelection) {
      if (item['genre'].findIndex((element) => element === genre) !== -1) {
        console.log('contains');
        idSelection.push(item.id);
      }
    }
    for (let i = 0; i < 20; i++) {
      getApiSeriesById(idSelection[i]).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
          checkRating(data);
        }
        paintSelection(mediaSelection);
        listenMakeFavoriteHeart();
        listenMakeWatchedEye();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );
      });
    }
  });
  console.log(genreSelection);
};

// generate a random number

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
