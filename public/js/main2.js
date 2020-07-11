'use strict';

// global data
let mediaType = '';
let idSelection = [];
let favoriteSeries = [];
let favoriteMovies = [];

// Starting the app
const startMovieApp = () => {
  console.log('Start');
  mediaType = 'series';
  // recuperar datos localstorage: global data
  generateRandomSelection(20);
//   for (const id of idSelection) {
//     getApiSeriesById(id).then((data) => {
//       console.log(data);
//       const mediaSelection = data;
//       paintSelection(mediaSelection);
//       console.log('PAinted');
//     });
  }

  // pintar datos
  // Escuchar
};

// helper
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

// Paint random Selection
const paintSelection = (media) => {
  const selectionAreaEl = document.querySelector('.js-selection-area');
  //   selectionAreaEl.innerHTML = '';
  selectionAreaEl.innerHTML += getSelectionHtmlCode(media);
};

const getSelectionHtmlCode = (media) => {
  let htmlCode = '';
  htmlCode += `  <h3>${media.name}</h3>`;
  htmlCode += `  <img src="${media.image.medium}">`;
  return htmlCode;
};

// get api

const getApiSeriesById = (id) => {
  return fetch(`//api.tvmaze.com/shows/${id}`).then((response) =>
    response.json()
  );
  // paint seriesId
};

// Start app
startMovieApp();
