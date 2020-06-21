/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const puppeteer = require('puppeteer');


const TRANSLATE_TO_LNG = 'ru';
let puppeteerBrowserHandle;

const wait = (delay) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

const closeBrowser = async () => {
  if (puppeteerBrowserHandle) {
    await puppeteerBrowserHandle.close();
  }
};

const launchBrowser = async () => {
  if (puppeteerBrowserHandle) {
    return puppeteerBrowserHandle;
  }

  console.log(chalk.yellow('Launch browser...'));
  puppeteerBrowserHandle = await puppeteer.launch({
    headless: true,
    args: ['--proxy-server=socks5://127.0.0.1:9050'],
  });

  console.log(chalk.green('Ready'));
  return puppeteerBrowserHandle;
};

const translate = async (pageHandle, sourceText) => {
  await pageHandle.waitForSelector('.orig.tlid-source-text-input.goog-textarea');
  const element = await pageHandle.$('.orig.tlid-source-text-input.goog-textarea');
  element.click();
  await pageHandle.keyboard.type(sourceText);
  // await wait(500);

  try {
    await pageHandle.waitForSelector('.tlid-translation.translation', {
      timeout: 3000,
    });
    const outputElem = await pageHandle.$('.tlid-translation.translation');
    const outputText = await pageHandle.evaluate((elem) => elem.innerText, outputElem);
    await sourceText.split('').reduce(async (prev) => {
      await prev;
      return pageHandle.keyboard.press('Backspace');
    }, Promise.resolve());
    return outputText;
  } catch (err) {
    console.log(chalk.blue('Selector timeout failure. Wait for it and try again'));
    return translate(pageHandle, sourceText);
  }
};

const translateChunk = async (chunk) => {
  return Promise.all(chunk.map(async (countryCode) => {
    console.log(chalk.yellow(`Page for «${countryCode}» will be opened`));
    const pageHandle = await puppeteerBrowserHandle.newPage();
    await pageHandle.goto(`https://translate.google.ru/#view=home&op=translate&sl=en&tl=${TRANSLATE_TO_LNG}`);

    await ['cities', 'states', 'countries'].reduce(async (prevTypePromise, currentType) => {
      await prevTypePromise;

      const sourceFilename = path.resolve(`./src/countries/${countryCode}/${currentType}.json`);
      const sourceListJSON = fs.readFileSync(sourceFilename);
      const sourceDataList = JSON.parse(sourceListJSON);
      const sourceDataTotalCount = sourceDataList.length;
      let sourceDataCurrentCount = 0;

      const wordsDataSet = new Map();
      const wordsList = Object.values(sourceDataList).map((data) => data.en);
      const wordsListPerChunks = wordsList.reduce((all, one, i) => {
        const ch = Math.floor(i / 100);
        all[ch] = [].concat((all[ch] || []), one);
        return all;
      }, []);

      await wordsListPerChunks.reduce(async (prevPromise, wordsListArray) => {
        await prevPromise;

        const words = wordsListArray.map((word) => {
          let prefix = '';
          switch (currentType) {
            case 'cities':
              prefix = 'city';
              break;
            case 'countries':
              prefix = 'country';
              break;
            case 'states':
              prefix = 'region';
              break;
            default:
              prefix = '';
              break;
          }
          return `${prefix} ${word}`;
        });


        const translatedStr = await translate(pageHandle, words.join('\n'));
        translatedStr.split('\n').forEach((translatedWordPre, translatedIndex) => {
          if (!words[translatedIndex]) {
            return;
          }
          const originalWord = words[translatedIndex].replace(/^(city|region|country)/, '');
          const translatedWord = translatedWordPre.trim().replace(/^(город\s|страна\s|регион\s|область\s|штат\s)/i, '');
          sourceDataCurrentCount += 1;
          console.log(`${countryCode} - ${currentType} [${sourceDataCurrentCount} of ${sourceDataTotalCount}] ${chalk.magenta(originalWord.trim())} ${chalk.grey('translated to')} ${TRANSLATE_TO_LNG} ${chalk.grey('->')} ${chalk.green(translatedWord.trim())}`);
          wordsDataSet.set(originalWord.trim(), translatedWord.trim());
        });
      }, Promise.resolve());

      const translatedSourceData = sourceDataList.map((data) => {
        const modifiedData = {
          ...data,
        };
        modifiedData[TRANSLATE_TO_LNG] = wordsDataSet.get(data.en) || data.en;
        return modifiedData;
      });

      console.log(chalk.green(`Update file ${sourceFilename}`));
      fs.writeFileSync(sourceFilename, JSON.stringify(translatedSourceData));
    }, Promise.resolve());

    console.log(chalk.yellow(`Page for «${countryCode}» will be closed`));
    await pageHandle.close();
  }));
};

const bootstrap = async () => {
  const files = fs.readdirSync(path.resolve('./src/countries'));
  // chunks
  const chunks = files.reduce((all, one, i) => {
    const ch = Math.floor(i / 5);
    all[ch] = [].concat((all[ch] || []), one);
    return all;
  }, []);

  await launchBrowser();
  // const StartAfter = 'AD';
  const StartAfter = 'MW';
  let skip = true;
  await chunks.reduce(async (prevPromise, chunk) => {
    await prevPromise;
    if (chunk.includes(StartAfter)) {
      skip = false;
    }
    if (!skip) {
      await translateChunk(chunk);
    }
  }, Promise.resolve());
  await closeBrowser();
};

bootstrap();
