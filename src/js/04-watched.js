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
  // delete if already there

  if (section === 'Watched') {
    console.log('Watched!');
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = watchedSeries.findIndex((element) => element === id);
    watchedSeries.splice(indexFound, 1);
    eye.classList.remove('watched-eye');
    mediaToDelete.style.display = 'none';
  } else {
    if (isMediaInList(id, watchedSeries)) {
      const indexFound = watchedSeries.findIndex((element) => element === id);
      watchedSeries.splice(indexFound, 1);
      eye.classList.remove('watched-eye');
      // add to favorites
    } else {
      watchedSeries.push(id);
      eye.classList.add('watched-eye');
    }
  }
  paintProfile();
  console.log(watchedSeries);
};

// show watched series

const showWatched = () => {
  section = 'Watched';
  console.log('Section: ' + section);
  let mediaSelection = [];
  for (const id of watchedSeries) {
    getApiSeriesById(id).then((data) => {
      // Check availabily
      if (data.status !== 404) {
        mediaSelection.push(data);
        checkImage(data);
      }
      paintSelection(mediaSelection);
      listenMakeWatchedEye();
      const eyes = document.querySelectorAll('.make-watched-eye');
      for (const eye of eyes) {
        eye.classList.add('watched-eye');
      }
    });
  }
};
