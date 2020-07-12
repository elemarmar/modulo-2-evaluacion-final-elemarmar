'use strict';

// global data
let user = {};
let avatarUrl = '';
let movieQuotes = '';

// start app
const startWelcomeApp = () => {
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
  // start app
  startMovieApp();
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

startWelcomeApp();
