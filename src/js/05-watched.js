/*****************************
 *       LISTEN EVENTS       *
 ****************************/

// btns add to watched

const listenMakeWatchedEye = () => {
  listenEvents('.media__poster-seen', addToWatched);
};

// btn show watched

const listenWatchedBtn = () => {
  const watchedBtnEl = document.querySelector('.js-watched-btn');
  watchedBtnEl.addEventListener('click', showWatched);
};

/*****************************
 *           HELPERS         *
 ****************************/

// add to watched:
//⚠️ A new function could be used for both addToWatched and addToFavorites,
// since they both follow same steps --> pending
// Also--> divide function in smaller steps --> pending

const addToWatched = (ev) => {
  const id = getClickedMediaId(ev);
  const eye = document.querySelector(`.make-watched-eye[data-id="${id}"]`);

  // delete from screen if user clicks on eye when in WATCHED section
  if (section === 'Watched') {
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = watchedSeries.findIndex((element) => element === id);
    watchedSeries.splice(indexFound, 1);
    user['watchedSeries'] = watchedSeries;
    setInLocalStorage();
    eye.classList.remove('watched-eye');
    mediaToDelete.style.display = 'none';
    // remove from watched list
  } else if (isMediaInList(id, watchedSeries)) {
    const indexFound = watchedSeries.findIndex((element) => element === id);
    watchedSeries.splice(indexFound, 1);
    user['watchedSeries'] = watchedSeries;
    setInLocalStorage();
    eye.classList.remove('watched-eye');
    // add to watched
  } else {
    watchedSeries.push(id);
    user['watchedSeries'] = watchedSeries;
    setInLocalStorage();
    eye.classList.add('watched-eye');
  }
  paintProfile();
};

// show watched series
// ⚠️ A new function could be used to simplify both showWatched and showFavorites
// since both follow same steps --> pending
const showWatched = () => {
  if (section !== 'Watched' && watchedSeries.length !== 0) {
    // avoids refreshing results when clicking several times on watched list
    section = 'Watched';
    changeGenreToAll();
    let mediaSelection = [];
    for (const id of watchedSeries) {
      getApiSeriesById(id).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
          checkRating(data);
        }
        // update everything
        paintSelection(mediaSelection);
        listenMakeWatchedEye();
        listenMakeFavoriteHeart();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );
      });
    }
  }
};


