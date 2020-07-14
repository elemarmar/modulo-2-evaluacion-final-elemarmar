'use strict';

/*************************
 *      Global data      *
 *************************/

let section = ''; // tells us in which section we are
let idSelection = []; // only contains ids of series to get from server
let favoriteSeries = [];
let watchedSeries = [];
// a mediaSeries array is used throughout the app, it
// contains the actual series info (object) of the idSelection

// list of genres from TV Maze api
const genreList = [
  'Action',
  'Adventure',
  'Anime',
  'Children',
  'Comedy',
  'Crime',
  'Drama',
  'Espionage',
  'Family',
  'Fantasy',
  'Food',
  'History',
  'Horror',
  'Legal',
  'Medical',
  'Music',
  'Mystery',
  'Nature',
  'Romance',
  'Science-Fiction',
  'Sports',
  'Supernatural',
  'Thriller',
  'Travel',
  'War',
  'Western',
];

/*************************
 *   Starting the app    *
 *************************/

// Starting the app

const startSeriesApp = () => {
  removeWelcomePage();
  getFromLocalStorage();

  // if use has favorite series from previous sessions,
  // add them to current favorite list
  if (user.favoriteSeries) {
    favoriteSeries = user.favoriteSeries;
  }
  if (user.watchedSeries) {
    // same with watched series
    watchedSeries = user.watchedSeries;
  }
  showRandomSelection();
  paintDropDownGenres(genreList);
  paintProfile();
  listenMenuBtns();
  listenDocument();
  listenErrorBtn();
};

// generates a random selection of series

const generateRandomSelection = (items) => {
  for (let i = 0; i < items; i++) {
    const number = randomNumber(4916);
    // make sure ids aren't repeated
    if (idSelection.indexOf(number) === -1) {
      idSelection.push(number); //--length (while)
    }
  }
};

// searches series by search-input value

const searchMedia = () => {
  section = 'Series';
  const query = document.querySelector('.js-search').value;
  getApiSeriesByName(query).then((data) => {
    const results = data;
    let mediaSelection = [];
    for (const result of results) {
      checkImage(result.show);
      checkRating(result.show);
      mediaSelection.push(result.show);
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
};

// shows a random selection of series

const showRandomSelection = () => {
  section = 'Series';
  idSelection = [];
  changeGenreToAll(); // changes genre to 'All'
  generateRandomSelection(50);
  initializeLoadBar(); // shows loading bar
  let mediaSelection = [];
  for (const id of idSelection) {
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
    });
  }
  // apply class to eye and heart btns
  applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
  applyClassIfInList('.make-favorite-heart', favoriteSeries, 'favorite-heart');
  listenMenuBtns();
  listenDocument();
};

// shows drop menu

const showDropMenu = () => {
  const genresBtn = document.querySelector('.dropdown-menu');
  genresBtn.classList.toggle('hidden');
};

// click anywhere closes the drop menu

const closeMenus = (e) => {
  const genresBtn = document.querySelector('.dropdown-menu');
  if (
    !e.target.classList.contains('js-filter-genre') &&
    !genresBtn.classList.contains('hidden')
  ) {
    genresBtn.classList.add('hidden');
  }
};

const initializeLoadBar = () => {
  const loadingBar = document.querySelector('.js-load-bar');
  loadingBar.classList.add('init-expand');
  setTimeout(function () {
    loadingBar.classList.remove('init-expand');
  }, 6500);
};

const removeWelcomePage = () => {
  const welcomePage = document.querySelector('.welcome__area');
  welcomePage.remove();
};

// change genre to All
const changeGenreToAll = () => {
  const genreText = document.querySelector('.value.js-filter-genre');
  genreText.innerHTML = 'All';
};

/*****************************
 *         LISTENERS         *
 ****************************/

// helper for multiple btns
const listenEvents = (selector, handler, eventType = 'click') => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.addEventListener(eventType, handler);
  }
};

const listenMenuBtns = () => {
  listenSearchBar();
  listenFavoritesBtn();
  listenWatchedBtn();
  listenSeriesBtn();
  listenProfileBtn();
  listenGenresBtn();
  listenGenres();
};

const listenSearchBar = () => {
  const searchInputEl = document.querySelector('.js-search');
  searchInputEl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchMedia();
      //   searchInputEl.value = '';
    }
  });
};

const listenGenres = () => {
  listenEvents('.js-genre-option', filterByGenres);
};

// listen favorites
const listenMakeFavoriteHeart = () => {
  listenEvents('.media__poster-favorite', addToFavorites);
};

const listenFavoritesBtn = () => {
  const favoriteBtnEl = document.querySelector('.user-favorites');
  const favoriteMenuEl = document.querySelector('.js-search__favorites');
  favoriteBtnEl.addEventListener('click', showFavorites);
  favoriteMenuEl.addEventListener('click', showFavorites);
};

// listen menu items
const listenSeriesBtn = () => {
  const seriesMenuEl = document.querySelector('.js-search__series');
  seriesMenuEl.addEventListener('click', showRandomSelection);
};

const listenProfileBtn = () => {
  const userMenuEl = document.querySelector('.js-user-profile');
  userMenuEl.addEventListener('click', showProfileMenu);
};

// Listen genre menu
const listenGenresBtn = () => {
  const genresBtn = document.querySelector('.filter.genres');
  genresBtn.addEventListener('click', showDropMenu);
};

// listens clicks on document --> for escaping drop-down menu
const listenDocument = () => {
  document.addEventListener('click', closeMenus);
};

/*****************************
 *        PAINT HTML         *
 ****************************/

// genres drop down menu

const paintDropDownGenres = (array) => {
  const dropDownEl = document.querySelector('.dropdown-menu');
  dropDownEl.innerHTML = '';
  for (const item of array) {
    dropDownEl.innerHTML += getDropDownHtmlCode(item);
  }
};

const getDropDownHtmlCode = (genre) => {
  let htmlCode = '';
  htmlCode += `<li>`;
  htmlCode += `<a href="#" data-genre=${genre} class="js-genre-option">${genre}</a>`;
  htmlCode += `</li>`;
  return htmlCode;
};

// paint random selection

const paintSelection = (media) => {
  const selectionAreaEl = document.querySelector('.js-selection-area');
  selectionAreaEl.innerHTML = '';
  for (const item of media) {
    selectionAreaEl.innerHTML += getSelectionHtmlCode(item);
  }
};

const getSelectionHtmlCode = (media) => {
  let htmlCode = '';
  htmlCode += `<article class="media__container" data-id="${media.id}">`;
  htmlCode += `<div class="cover" style="background-image: url('${media.image}')"> `;
  htmlCode += `<div class="cover-imgs" ></div>`;
  htmlCode += `<div class="cover-overlay cover-info-overlay">`;
  htmlCode += `<div class="media__poster-check">`;
  htmlCode += `<span class="media__poster-seen">`;
  htmlCode += `<i class="far fa-eye make-watched-eye" data-id="${media.id}"></i></span>`;
  htmlCode += `<span class="media__poster-favorite">`;
  htmlCode += `<i class="fas fa-heart  make-favorite-heart" data-id="${media.id}"></i>`;
  htmlCode += `</span>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__poster-rating">`;
  htmlCode += `<span class="media__poster-stars">${calculateRatingStars(
    media.rating.average
  )}`;
  htmlCode += `</span>`;
  htmlCode += `<span class="media__poster-score">${media.rating.average}</span>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__simple-info">`;
  htmlCode += `<h4 class="media__poster-title">${media.name}</h4>`;
  htmlCode += `<p class="media__poster-year">${media.premiered}</p>`;
  htmlCode += `</div>`;
  htmlCode += `</article>`;
  return htmlCode;
};

/*************************
 *          API          *
 *************************/

const getApiSeriesById = (id) => {
  return fetch(`//api.tvmaze.com/shows/${id}`).then((response) =>
    response.json()
  );
};

const getApiSeriesByName = (query) => {
  return fetch(`//api.tvmaze.com/search/shows?q=${query}`).then((response) =>
    response.json()
  );
};

const getApiSeriesByGenre = () => {
  return fetch(`./public/api/genres.json`).then((response) => response.json());
};
