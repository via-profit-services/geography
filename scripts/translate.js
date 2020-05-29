/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * This code will be convert JSON files from repository https://github.com/dr5hn/countries-states-cities-database
 * to another JSON files with UUID v4 IDs and «CamelCase» fields
 */


const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const translate = require('translation-google');

const cities = require('../source/cities');
const countries = require('../source/countries');
const states = require('../source/states');

const translates = ['ru'];
translate('Hello', { to: 'ru' }).then((r) => console.log('res', r));
const wait = (delay) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

const translateAndFill = async (data) => {
  const translatedData = {};

  await translates.reduce(async (prev, lng) => {
    await prev;


    // chunks
    const chunks = data.reduce((all, one, i) => {
      const ch = Math.floor(i / 50);
      all[ch] = [].concat((all[ch] || []), one);
      return all;
    }, []);


    return chunks.reduce(async (prevChunk, chunk, chunkIndex) => {
      await prevChunk;

      console.log(`Translate chunk ${chunkIndex} of ${chunks.length}`);
      const names = data.map((el) => el.name);
      let translatedNames = [];
      try {
        // console.log();
        translatedNames = await translate(names.join('|'),
          { to: lng })
          .then((r) => {
            console.log(r);
            return r.text.split('|').map((n) => n.trim());
          });
      } catch (err) {
        console.error('Error', err);
      }

      chunk.forEach((original, index) => {
        translatedData[lng] = translatedData[lng] || {};
        translatedData[lng][original.name] = translatedNames[index] || '';
      });


      await wait(1000);
    });
  }, Promise.resolve());

  return translatedData;
};


const bootstrap = async () => {
  console.log(chalk.green('Start'));

  // const citiesTr = await translateAndFill(cities);
  const countriesTr = await translateAndFill(countries);
  // const statesTr = await translateAndFill(states);

  translates.forEach((lng) => {
    const dir = path.resolve(`./translate/${lng}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // fs.writeFileSync(`${dir}/cities.json`, JSON.stringify(citiesTr[lng]));
    fs.writeFileSync(`${dir}/countries.json`, JSON.stringify(countriesTr[lng]));
    // fs.writeFileSync(`${dir}/states.json`, JSON.stringify(statesTr[lng]));
  });


  console.log(chalk.green('Done'));
};

bootstrap();
