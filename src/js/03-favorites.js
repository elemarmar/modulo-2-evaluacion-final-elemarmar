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
    heart.classList.remove('favorite-heart');
    mediaToDelete.style.display = 'none';

    console.log(mediaToDelete);
  } else {
    if (isMediaInList(id, favoriteSeries)) {
      const indexFound = favoriteSeries.findIndex((element) => element === id);
      favoriteSeries.splice(indexFound, 1);
      heart.classList.remove('favorite-heart');
      // add to favorites
    } else {
      favoriteSeries.push(id);
      heart.classList.add('favorite-heart');
    }
  }
  paintProfile();
  console.log(favoriteSeries);
};
