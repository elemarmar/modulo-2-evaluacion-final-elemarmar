'use strict';

// global data
let user = {};
let avatarUrl = '';

// start app
const startApp = () => {
  getFromLocalStorage();
  if (user.name) {
    paintWelcome();
  } else {
    getApiData(randomString()).then(() => {
      paintRequestInfo();
      listenNameInput();
      listenRefreshAvatar();
    });
  }
};

// helpers

const randomizeAvatar = () => {
  const newAvatar = randomString();
  paintAvatar(newAvatar);
};

const randomString = () => {
  return Math.random().toString(36).substr(2, 5);
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
  htmlCode += `<h1>Hello</h1>`;
  htmlCode += `<div class="request__info--area">`;
  htmlCode += `   <h2>What's your name?</h2>`;
  htmlCode += `   <input type="text" name="name" class="request__info-name js-user-name" autocomplete="off">`;
  htmlCode += `   <div class="request__info--avatar">`;
  htmlCode += `       <div class="avatar__container">`;
  htmlCode += `           <img src="${url}" alt="avatar image" class="avatar">`;
  htmlCode += `      </div>`;
  htmlCode += `      <p class="instructions">Not happy? <i class="fas fa-sync-alt js-refresh-avatar refresh-avatar"></i> </p>`;
  htmlCode += `   </div>`;
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
  htmlCode += `<h1>Hello, ${user.name}</h1>`;
  htmlCode += `     <div class="avatar__container">`;
  htmlCode += `           <img src="${user.avatar}" alt="avatar image" class="avatar">`;
  htmlCode += `     </div>`;
  htmlCode += `     <p class="quote">quote</p>`;
  htmlCode += `   </div>`;
  htmlCode += `</div>`;
  return htmlCode;
};

// api

const getApiData = (string) => {
  return fetch(
    `https://avatars.dicebear.com/api/avataaars/${string}.svg?options[mouth][]=smile`
  ).then((data) => (avatarUrl = data.url));
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
