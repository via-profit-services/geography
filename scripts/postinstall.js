/* eslint-disable */
const fs = require('fs');
const path = require('path');

const initCWD = process.env.INIT_CWD;
const migrationsSource = path.resolve(__dirname, '../.knex/migrations');
const migrationsDestination = path.resolve(initCWD, './.knex/migrations');
const dataSource = path.resolve(__dirname, '../data');
const dataDestination = path.resolve(initCWD, './.data/geography');
const migrationFiles = fs.readdirSync(migrationsSource);

// check migration paths
if (!fs.existsSync(migrationsDestination)) {
  fs.mkdirSync(migrationsDestination, { recursive: true });
}

// check data paths
if (!fs.existsSync(dataDestination)) {
  fs.mkdirSync(dataDestination, { recursive: true });
}

// copy migrations
migrationFiles.forEach((filename) => {
  fs.copyFileSync(
    path.resolve(migrationsSource, filename),
    path.resolve(migrationsDestination, filename),
  )
});


// copy data
fs.readdirSync(dataSource).forEach((countryCode) => {
  ['cities.json', 'countries.json', 'states.json'].forEach((filename) => {
    const sourceFile = path.resolve(dataSource, countryCode, filename);
    const destinationFile = path.resolve(dataDestination, countryCode, filename);

    if (!fs.existsSync(path.dirname(destinationFile))) {
      fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
    }
    
    fs.copyFileSync(sourceFile, destinationFile);
  });
});
