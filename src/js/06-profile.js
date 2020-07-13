// show profile menu

const showProfileMenu = () => {
  const userMenuEl = document.querySelector('.profile__menu');
  userMenuEl.classList.toggle('expand');
};

/*************************
 *     paint profile     *
 *************************/

const paintProfile = () => {
  const profileAreaEl = document.querySelector('.js-profile-menu');
  profileAreaEl.innerHTML = '';
  profileAreaEl.innerHTML = getProfileHtmlCode();
  const userMenuAvatarEl = document.querySelector('.user-profile');
  userMenuAvatarEl.style.backgroundImage = `url('${user.avatar}')`;
};

const getProfileHtmlCode = () => {
  let htmlCode = '';
  htmlCode += `<div class="avatar" style="background-image: url('${user.avatar}')"></div>`;
  htmlCode += `<h2 class="profile-name">${user.name}</h2>`;
  htmlCode += `<div class="">`;
  htmlCode += `  <ul class="profile__info">`;
  htmlCode += `    <li class="profile__section series">`;
  htmlCode += `      <span class="percentage">${calculatePerctTotalSeries(
    watchedSeries
  )}%</span>`;
  htmlCode += `      <span class="watched-info">Series watched: ${watchedSeries.length}</span>`;
  htmlCode += `   </li>`;
  // For next release: movie stats
  //   htmlCode += `    <li class="profile__section movies">`;
  //   htmlCode += `      <span class="percentage">52%</span>`;
  //   htmlCode += `     <span class="watched-info">Movies watched: 23</span>`;
  //   htmlCode += `   </li>`;
  htmlCode += `   <li class="profile__section heart">`;
  htmlCode += `     <span class="percentage">${calculatePerctTotalSeries(
    favoriteSeries
  )}%</span>`;
  htmlCode += `     <span class="watched-info">Favorite series: ${favoriteSeries.length}</span>`;
  htmlCode += `    </li>`;
  htmlCode += `  </ul>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="copyright">`;
  htmlCode += `<div class="creator-avatar"></div>`;
  htmlCode += `<h3 class="about-me">About me</h3>`;
  htmlCode += ` <p class="author-message">`;
  htmlCode += `   Apart from movies I also love`;
  htmlCode += `   <span class="keyword">programming</span> and`;
  htmlCode += `   <span class="keyword">learning languages!</span>`;
  htmlCode += ` </p>`;
  htmlCode += `  <p >`;
  htmlCode += `   Checkout my Github page for more:`;
  htmlCode += `</p>`;
  htmlCode += `<p class="github-info">`;
  htmlCode += `   <a class="github-link" href="https://github.com/elemarmar" target="_blank">`;
  htmlCode += `<i class="fab fa-github-alt"></i> Elemarmar 🦊`;
  htmlCode += `</a>`;
  htmlCode += `</p>`;
  htmlCode += `</div>`;
  return htmlCode;
};
