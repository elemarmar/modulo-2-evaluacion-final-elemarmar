// Mostrar mensaje de próxima feature

const listenErrorBtn = () => {
  const moviesBtnEl = document.querySelector('.search__movies');
  const listsBtnEl = document.querySelector('.user-lists');
  moviesBtnEl.addEventListener('click', showErrorMessage);
  listsBtnEl.addEventListener('click', showErrorMessage);
};

const showErrorMessage = () => {
  section = 'Error';
  const selectionArea = document.querySelector('.js-selection-area');
  selectionArea.innerHTML = '';
  let codeHTML = '';
  codeHTML += `<div class="error__container">`;
  codeHTML += '<h2 class="error-title">Ups ! </h2>';
  codeHTML +=
    '<p class="error-text">This feature is currently unavailable but will come out very soon. Stay tuned!</p>';
  codeHTML += `<div class="error-avatar" style="background-image: url('https://avatars.dicebear.com/api/avataaars/${user.name}.svg?options[mouth][]=sad&options[style]=circle&options[eyes][]=roll&options[b]=%23900')"></div>`;
  codeHTML += `</div>`;
  selectionArea.innerHTML = codeHTML;
};
