/*************************
 *      HELPERS          *
 *************************/

// Calculate % of watched series
const calculatePerctTotalSeries = (array) => {
  const totalNumber = 49146;
  const watchedNumber = array.length;
  const result = (watchedNumber * 100) / totalNumber;

  return result.toFixed(2);
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

const isMediaInList = (id, list) => {
  return !!list.find((element) => element === id);
};
