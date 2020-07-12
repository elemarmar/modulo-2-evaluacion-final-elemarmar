'use strict';

// global data
let mediaType = '';
let idSelection = [];
let favoriteSeries = [];
let favoriteMovies = [];

// Starting the app
const startMovieApp = () => {
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
    });
  }
  listenMenuBtns();
};

// helpers
const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
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

const getClickedMediaId = (ev) => {
  return ev.target.dataset.id;
};

const addToFavorites = (ev) => {
  const id = getClickedMediaId(ev);
  // delete if already there
  if (isMediaInFavorites(id)) {
    const indexFound = favoriteSeries.findIndex((element) => element === id);
    favoriteSeries.splice(indexFound, 1);
    // add to favorites
  } else {
    favoriteSeries.push(id);
    const heart = document.querySelector(`[data-id="${id}"]`);
    heart.style.color = 'red';
  }

  console.log(favoriteSeries);
};

const isMediaInFavorites = (id) => {
  return !!favoriteSeries.find((element) => element === id);
};

const showFavorites = () => {
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
    });
  }
};

const showRandomSelection = () => {
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
    }
  });
};
// const listenSearchBtn = () => {
//   const searchInputBtnEl = document.querySelector('.js-btn-search');
//   searchInputBtnEl.addEventListener('click', searchMedia);
// };

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
  listenSeriesBtn();
  listenProfileBtn();
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

/*****************************
 *        PAINT HTML         *
 ****************************/

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
  htmlCode += `<div class="media__container">`;
  htmlCode += `   <div class="media__poster" style="background-image: url('${media.image}');">`;
  htmlCode += `<div class="media__poster-check">`;
  htmlCode += `<span class="media__poster-seen"><i class="far fa-eye"></i></span>`;
  htmlCode += `<span class="media__poster-favorite"><i class="fas fa-heart make-favorite-heart" data-id="${media.id}"></i></span>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__poster-rating">`;
  htmlCode += `<span class="media__poster-stars"><i class="fas fa-star"></i></span>`;
  htmlCode += `<span class="media__poster-score">4.10</span>`;
  htmlCode += ` </div>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__simple-info">`;
  htmlCode += `<h4 class="media__poster-title">${media.name}</h4>`;
  htmlCode += `<p class="media__poster-eyar">2019</p>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
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

// events

const listenEvents = (selector, handler, eventType = 'click') => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.addEventListener(eventType, handler);
  }
};

// start app
startMovieApp();
