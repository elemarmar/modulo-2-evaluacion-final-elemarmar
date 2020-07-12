'use strict';

// global data
let section = '';
let mediaType = '';
let idSelection = [];
let favoriteSeries = [];
let favoriteMovies = [];
let watchedSeries = [];
const genreList = [
  'Action',
  'Adult',
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

// Starting the app
const startMovieApp = () => {
  removeWelcomePage();
  initializeLoadBar();
  mediaType = 'series';
  // recuperar datos localstorage: global data
  generateRandomSelection(20);
  let mediaSelection = [];
  for (const id of idSelection) {
    getApiSeriesById(id).then((data) => {
      // Check availabily
      if (data.status !== 404) {
        mediaSelection.push(data);
        checkImage(data);
      }
      paintSelection(mediaSelection);
      listenMakeFavoriteHeart();
      listenMakeWatchedEye();
    });
  }
  paintDropDownGenres(genreList);
  paintProfile();
  listenMenuBtns();
};

const generateRandomSelection = (items) => {
  // Hay que asegurarse que no se repiten IDs
  for (let i = 0; i < items; i++) {
    const number = randomNumber(4916);
    // Make sure no ID is repeated
    if (idSelection.indexOf(number) === -1) {
      idSelection.push(number);
    }
  }
};

const searchMedia = () => {
  const query = document.querySelector('.js-search').value;
  getApiSeriesByName(query).then((data) => {
    const results = data;
    let mediaSelection = [];
    for (const result of results) {
      checkImage(result.show);
      mediaSelection.push(result.show);
      console.log(mediaSelection);
    }
    paintSelection(mediaSelection);
  });
};

// const updateFavoriteSection = (ev) => {
//   listenMakeFavoriteHeart();
//   const id = getClickedMediaId(ev);

// };
const showFavorites = () => {
  section = 'Favorites';
  console.log('Section: ' + section);
  let mediaSelection = [];
  for (const id of favoriteSeries) {
    getApiSeriesById(id).then((data) => {
      // Check availabily
      if (data.status !== 404) {
        mediaSelection.push(data);
        checkImage(data);
      }
      paintSelection(mediaSelection);
      listenMakeFavoriteHeart();
      const hearts = document.querySelectorAll('.make-favorite-heart');
      for (const heart of hearts) {
        heart.classList.add('favorite-heart');
      }
    });
  }
};

const showRandomSelection = () => {
  section = 'Series';
  console.log(section);
  console.log('there');
  idSelection = [];
  generateRandomSelection(20);

  let mediaSelection = [];
  for (const id of idSelection) {
    getApiSeriesById(id)
      .then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
        }
        paintSelection(mediaSelection);
      })
      .then(listenMakeFavoriteHeart());
  }
  listenMenuBtns();
};

const showProfileMenu = () => {
  const userMenuEl = document.querySelector('.profile__menu');
  userMenuEl.classList.toggle('expand');
  console.log('profile');
};
/*****************************
 *         LISTENERS         *
 ****************************/

const listenSearchBar = () => {
  const searchInputEl = document.querySelector('.js-search');
  searchInputEl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchMedia();
      searchInputEl.value = '';
    }
  });
};
// const listenSearchBtn = () => {
//   const searchInputBtnEl = document.querySelector('.js-btn-search');
//   searchInputBtnEl.addEventListener('click', searchMedia);
// };

const listenGenres = () => {
  listenEvents('.js-genre-option', filterByGenres);
};

const filterByGenres = (e) => {
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
        }
        paintSelection(mediaSelection);
        listenMakeFavoriteHeart();
      });
    }
  });
  console.log(genreSelection);
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

const listenMenuBtns = () => {
  listenSearchBar();
  //   listenSearchBtn();
  listenFavoritesBtn();
  listenWatchedBtn();
  listenSeriesBtn();
  listenProfileBtn();
  listenGenresBtn();
  listenGenres();
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

const showDropMenu = () => {
  const genresBtn = document.querySelector('.dropdown-menu');
  genresBtn.classList.toggle('hidden');
};

const listenDocument = () => {
  document.addEventListener('click', closeMenus);
};

const closeMenus = (e) => {
  const genresBtn = document.querySelector('.dropdown-menu');
  if (
    !e.target.classList.contains('js-filter-genre') &&
    !genresBtn.classList.contains('hidden')
  ) {
    genresBtn.classList.add('hidden');
  }
};
listenDocument();
/*****************************
 *        PAINT HTML         *
 ****************************/
// Paint Drop down menu (genres)
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
// Paint random Selection
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
  htmlCode += `<div div class="cover" style="background-image: url('${media.image}')"> `;
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
  htmlCode += `<span class="media__poster-stars">`;
  htmlCode += ` <i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="far fa-star"></i>`;
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

// get api

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

// events

const listenEvents = (selector, handler, eventType = 'click') => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.addEventListener(eventType, handler);
  }
};

const initializeLoadBar = () => {
  const loadingBar = document.querySelector('.js-load-bar');
  loadingBar.classList.add('init-expand');
};

const removeWelcomePage = () => {
  const welcomePage = document.querySelector('.welcome__area');
  welcomePage.remove();
};
