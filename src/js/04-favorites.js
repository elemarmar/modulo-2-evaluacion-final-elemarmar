// add / delete from favorites

const addToFavorites = (ev) => {
  const id = getClickedMediaId(ev);
  const heart = document.querySelector(`.make-favorite-heart[data-id="${id}"]`);

  // if user is in Favorite Section, delete movies from screen when clicking on heart
  if (section === 'Favorites') {
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = favoriteSeries.findIndex((element) => element === id);
    favoriteSeries.splice(indexFound, 1);
    user['favoriteSeries'] = favoriteSeries;
    setInLocalStorage();
    heart.classList.remove('favorite-heart');
    mediaToDelete.style.display = 'none';
    // if user is NOT in Favorite Section and clicks on favorited item,
    // remove it from favorite list
  } else if (isMediaInList(id, favoriteSeries)) {
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
  paintProfile();
};

// show favorites section
const showFavorites = () => {
  if (section !== 'Favorites' && favoriteSeries.length !== 0) {
    // this avoids refreshing favorites
    section = 'Favorites';
    changeGenreToAll();
    let mediaSelection = [];
    for (const id of favoriteSeries) {
      getApiSeriesById(id).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
          checkRating(data);
        }
        // update everything
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
  }
};
