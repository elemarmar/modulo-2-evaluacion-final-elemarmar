// check rating and if null -> don't show
const checkRating = (result) => {
  if (!result.rating.average) {
    result.rating.average = '';
  } else {
    calculateRatingStars(result.rating.average);
  }
};

// calculate stars based on average score
// ⚠️ This is too manual --> find better way for next release
const calculateRatingStars = (average) => {
  let stars = '';
  switch (true) {
    case average > 9:
      for (let i = 0; i < 5; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      break;
    case average > 8:
      for (let i = 0; i < 4; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      stars += '<i class="fas fa-star-half-alt"></i>';
      break;
    case average > 7:
      for (let i = 0; i < 4; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      stars += `<i class="far fa-star"></i>`;
      break;
    case average > 6:
      for (let i = 0; i < 3; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      stars += '<i class="fas fa-star-half-alt"></i>';
      stars += `<i class="far fa-star"></i>`;
      break;
    case average > 4:
      for (let i = 0; i < 2; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      stars += '<i class="fas fa-star-half-alt"></i>';
      for (let i = 0; i < 2; i++) {
        stars += `<i class="far fa-star"></i>`;
      }
      break;
    case average > 3:
      for (let i = 0; i < 2; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      for (let i = 0; i < 3; i++) {
        stars += `<i class="far fa-star"></i>`;
      }
      break;
    case average > 1:
      stars += '<i class="fas fa-star"></i>';
      for (let i = 0; i < 4; i++) {
        stars += `<i class="far fa-star"></i>`;
      }
      break;
    default:
      stars = '';
  }
  return stars;
};

/*************************
 *   start the app   🎉  *
 *************************/

startWelcomeApp();
