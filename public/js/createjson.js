'use strict';

/*****************************
 *        MAKE JSON          *
 ****************************/

// Crear array
let seriesGenresId = [];

// generate selection (ALL movies)
generateRandomSelection(20);

// for loop
for (const id of idSelection) {
  getApiSeriesById(id).then((data) => {
    // Check availabily
    if (data.status !== 404) {
      const series = {};
      series.id = data.id;
      series.genre = data.genres;
      seriesGenresId.push(series);
    }
  });
}

const myJson = JSON.stringify(seriesGenresId);
console.log(seriesGenresId);

fs.writeFile('series-genre.json', myJson, function (err, result) {
  if (err) console.log('error', err);
});
