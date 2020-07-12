'use strict';

// global data
let user = {};
let avatarUrl = '';
let movieQuotes = '';

// start app
const startApp = () => {
  getFromLocalStorage();
  if (user.name) {
    showWelcomePage();
  } else {
    getApiData(randomString()).then(() => {
      paintRequestInfo();
      listenNameInput();
      listenRefreshAvatar();
      listenAcceptNameAvatar();
    });
  }
};

// helpers
const showWelcomePage = () => {
  paintWelcome();
  getApiQuotes();
  listenKeyEnd();
};

const randomizeAvatar = () => {
  const newAvatar = randomString();
  paintAvatar(newAvatar);
};

const randomString = () => {
  return Math.random().toString(36).substr(2, 5);
};

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const takeToWebsite = () => {
  window.location.href = './app.html';
};

const fadeOut = () => {
  const page = document.querySelector('.welcome__area');
  page.classList.add('fade-out');
  const temp = setTimeout(takeToWebsite, 4000);
};

// listen events
const listenNameInput = () => {
  const inputNameEl = document.querySelector('.request__info-name');
  inputNameEl.addEventListener('keyup', function () {
    const inputNameValue = inputNameEl.value;
    console.log(inputNameValue);
    user['name'] = inputNameValue;
    paintAvatar(inputNameValue);
    setInLocalStorage();
  });
};

const listenRefreshAvatar = () => {
  const refreshEl = document.querySelector('.refresh-avatar');
  refreshEl.addEventListener('click', randomizeAvatar);
  setInLocalStorage();
};

const listenAcceptNameAvatar = () => {
  const happyEl = document.querySelector('.js-happy');
  happyEl.addEventListener('click', showWelcomePage);
};

const listenKeyEnd = () => {
  document.addEventListener('keydown', fadeOut);
};

// Paint and refresh avatar

const paintAvatar = (username) => {
  let htmlCode = '';
  const avatarContainer = document.querySelector('.avatar__container');
  getApiData(username).then(() => {
    htmlCode += `<img src="${avatarUrl}" alt="avatar image" class="avatar">`;
    avatarContainer.innerHTML = htmlCode;
    user['avatar'] = avatarUrl;
    setInLocalStorage();
  });
};

// Paint Request info message

const paintRequestInfo = () => {
  let requestInfocode = '';
  requestInfocode += getRequestInfoHtmlCode(avatarUrl);
  const requestInfoElement = document.querySelector('.welcome__area');
  requestInfoElement.innerHTML = requestInfocode;
};

const getRequestInfoHtmlCode = (url) => {
  let htmlCode = '';
  htmlCode += `<div class="welcome__container">`;
  htmlCode += `<h1 class="welcome-title welcome-request">Hello</h1>`;
  htmlCode += `<div class="request__info--area">`;
  htmlCode += `   <h2 class="request__info-title">What's your name?</h2>`;
  htmlCode += `     <input type="text" name="name" class="request__info-name js-user-name" autocomplete="off" placeholder="ELENA">`;
  htmlCode += `   <div class="input-highlight"></div>`;
  htmlCode += `   <div class="request__info--avatar">`;
  htmlCode += `       <div class="avatar__container">`;
  htmlCode += `           <img src="${url}" alt="avatar image" class="avatar">`;
  htmlCode += `      </div>`;
  htmlCode += `      <p class="avatar-description">`;
  htmlCode += `           <span class="js-not-happy not-happy">Not happy ?</span>`;
  htmlCode += `           <i class="fas fa-sync-alt js-refresh-avatar refresh-avatar"></i>`;
  htmlCode += `           <span class="js-happy happy">Happy ?</span>`;
  htmlCode += `      </p>`;
  htmlCode += `   </div>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  return htmlCode;
};

// Paint Welcome message

const paintWelcome = () => {
  let welcomeHtmlCode = '';
  welcomeHtmlCode += getWelcomeHtmlCode();
  const welcomeAreaEl = document.querySelector('.welcome__area');
  welcomeAreaEl.innerHTML = welcomeHtmlCode;
};

const getWelcomeHtmlCode = () => {
  let htmlCode = '';
  htmlCode += `<div class="welcome__container">`;
  htmlCode += `     <h1 class="welcome-title">Hello, <span class="name">${user.name}</span></h1>`;
  htmlCode += `     <div class="avatar__container">`;
  htmlCode += `           <img src="${user.avatar}" alt="avatar image" class="avatar fade-in">`;
  htmlCode += `     </div>`;
  htmlCode += `     <p class="quote fade-in js-quote"></p>`;
  htmlCode += `</div>`;
  htmlCode += `<span class="enter-message">Press any key <i class="fas fa-chevron-circle-right"></i></span>`;
  return htmlCode;
};

// api

const getApiData = (string) => {
  return fetch(
    `https://avatars.dicebear.com/api/avataaars/${string}.svg?options[mouth][]=smile`
  ).then((data) => (avatarUrl = data.url));
};

const getApiQuotes = () => {
  fetch('./public/api/data.json')
    .then((response) => response.json())
    .then((data) => {
      const movieQuotes = data;
      const randomQuoteEl = document.querySelector('.js-quote');
      randomQuoteEl.innerHTML = movieQuotes[randomNumber(movieQuotes.length)];
    });
};

// local storage

const getFromLocalStorage = () => {
  const localStorageUser = localStorage.getItem('userDataLog');
  if (localStorageUser !== null) {
    user = JSON.parse(localStorageUser);
  }
};

const setInLocalStorage = () => {
  const stringifyUser = JSON.stringify(user);
  localStorage.setItem('userDataLog', stringifyUser);
};

// start app

startApp();

('use strict');

// global data
let mediaType = '';
let idSelection = [];
let favoriteSeries = [];
let favoriteMovies = [];
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
  paintDropDownGenres(genreList);
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

// start app
startMovieApp();
