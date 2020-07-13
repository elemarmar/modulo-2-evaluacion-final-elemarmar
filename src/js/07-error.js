// Mostrar mensaje de próxima feature

const listenErrorBtn = () => {
  const moviesBtnEl = document.querySelector('.search__movies');
  const listsBtnEl = document.querySelector('.user-lists');
  moviesBtnEl.addEventListener('click', showErrorMessage);
  listsBtnEl.addEventListener('click', showErrorMessage);
};

const changeErrorImage = () => {
  const avatar = JSON.parse(localStorage.getItem('userDataLog')).avatar;
  const newAvatar = avatar.replace(
    'smile',
    'sad&options[style]=circle&options[eyes][]=roll&options[b]=%23900'
  );
  console.log(newAvatar);
  return newAvatar;
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
  codeHTML += `<div class="error-avatar" style="background-image: url('${changeErrorImage()}')"></div>`;
  codeHTML += `</div>`;
  selectionArea.innerHTML = codeHTML;
};
