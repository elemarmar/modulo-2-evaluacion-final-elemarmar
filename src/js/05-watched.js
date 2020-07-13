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

// add to watched

const addToWatched = (ev) => {
  const id = getClickedMediaId(ev);
  const eye = document.querySelector(`.make-watched-eye[data-id="${id}"]`);
  console.log(eye);
  // delete if already there

  if (section === 'Watched') {
    console.log('Watched!');
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = watchedSeries.findIndex((element) => element === id);
    watchedSeries.splice(indexFound, 1);
    user['watchedSeries'] = watchedSeries;
    setInLocalStorage();
    eye.classList.remove('watched-eye');
    mediaToDelete.style.display = 'none';
  } else {
    if (isMediaInList(id, watchedSeries)) {
      const indexFound = watchedSeries.findIndex((element) => element === id);
      watchedSeries.splice(indexFound, 1);
      user['watchedSeries'] = watchedSeries;
      setInLocalStorage();
      eye.classList.remove('watched-eye');
      // add to favorites
    } else {
      watchedSeries.push(id);
      user['watchedSeries'] = watchedSeries;
      setInLocalStorage();
      eye.classList.add('watched-eye');
    }
  }
  paintProfile();
  console.log(watchedSeries);
};

// show watched series

const showWatched = () => {
  if (section !== 'Watched' && watchedSeries.length !== 0) {
    section = 'Watched';
    changeGenreToAll();
    console.log('Section: ' + section);
    let mediaSelection = [];
    for (const id of watchedSeries) {
      getApiSeriesById(id).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
          checkRating(data);
        }
        paintSelection(mediaSelection);
        listenMakeWatchedEye();
        listenMakeFavoriteHeart();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');

        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );

        //   const eyes = document.querySelectorAll('.make-watched-eye');
        //   for (const eye of eyes) {
        //     eye.classList.add('watched-eye');
        //   }
      });
    }
  }
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
