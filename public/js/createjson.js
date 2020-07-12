'use strict';

/*****************************
 *        MAKE JSON          *
 ****************************/
// Random min max
// Crear array
let seriesGenresId = [];

const makeit = () => {
  // generate selection (ALL movies)
  generateRandomSelection(100);

  // for loop

  setTimeout(function () {
    for (const id of idSelection) {
      getApiSeriesById(id).then((data) => {
        console.log(data.name);
        // Check availabily
        if (data.status !== 404) {
          const series = {};
          series.id = data.id;
          series.genre = data.genres;
          seriesGenresId.push(series);
        }
      });
    }
  }, 2000);

  const myJson = JSON.stringify(seriesGenresId);
  console.log(seriesGenresId);
};
