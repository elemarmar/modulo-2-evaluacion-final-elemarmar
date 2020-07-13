// add / delete from favorites

const addToFavorites = (ev) => {
  console.log('ENter');
  const id = getClickedMediaId(ev);
  const heart = document.querySelector(`.make-favorite-heart[data-id="${id}"]`);
  // delete if already there

  if (section === 'Favorites') {
    console.log('FAvorites!');
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = favoriteSeries.findIndex((element) => element === id);
    favoriteSeries.splice(indexFound, 1);
    user['favoriteSeries'] = favoriteSeries;
    setInLocalStorage();
    heart.classList.remove('favorite-heart');
    mediaToDelete.style.display = 'none';

    console.log(mediaToDelete);
  } else {
    if (isMediaInList(id, favoriteSeries)) {
      const indexFound = favoriteSeries.findIndex((element) => element === id);
      favoriteSeries.splice(indexFound, 1);
      user['favoriteSeries'] = favoriteSeries;
      setInLocalStorage();
      heart.classList.remove('favorite-heart');
      // add to favorites
    } else {
      favoriteSeries.push(id);
      user['favoriteSeries'] = favoriteSeries;
      setInLocalStorage();
      heart.classList.add('favorite-heart');
    }
  }
  paintProfile();
  console.log(favoriteSeries);
};

// show favorites section
const showFavorites = () => {
  if (section !== 'Favorites' && favoriteSeries.length !== 0) {
    section = 'Favorites';
    changeGenreToAll();
    console.log('Section: ' + section);
    let mediaSelection = [];
    for (const id of favoriteSeries) {
      getApiSeriesById(id).then((data) => {
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
        //   for (const heart of hearts) {
        //     heart.classList.add('favorite-heart');
        //   }
      });
    }
  }
};
