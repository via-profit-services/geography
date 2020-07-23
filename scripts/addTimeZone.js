/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const geoTz = require('geo-tz');

const bootstrap = async () => {
  console.log(chalk.green('Start'));

  const files = fs.readdirSync(path.resolve('./src/countries'));
  files.forEach((countryCode) => {
    const sourceFilename = path.resolve(`./src/countries/${countryCode}/cities.json`);
    const sourceListJSON = fs.readFileSync(sourceFilename);
    const sourceDataList = JSON.parse(sourceListJSON);

    const affectedCities = sourceDataList.map((city) => {
      const timezones = geoTz(city.latitude, city.longitude);
      return {
        ...city,
        timezone: timezones[0] || 'Europe/London',
      };
    });

    console.log(chalk.green(`Update file ${sourceFilename}`));
    fs.writeFileSync(sourceFilename, JSON.stringify(affectedCities));
  });

  console.log(chalk.green('Finish'));
};

bootstrap();
