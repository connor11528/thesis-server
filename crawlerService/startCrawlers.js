const frontPageCrawler = require('./frontPageCrawler');
const crawlUrl = require('./postCrawler').crawlUrl;
const scheduler = require('./scheduler');
const whitelist = require('./whitelist.json');
const prompt = require('prompt');
const colors = require('colors/safe');
prompt.message = colors.underline.green('BlogRank');
prompt.delimiter = colors.green(' <-=-=-=-=-=-> ');


const whiteListKeys = Object.keys(whitelist);
const startTime = new Date();

const start = () => {
  if (process.argv.indexOf('--continue') > -1) {
    const queue = require('./queue.json');

    scheduler.scheduleCrawlersMulti(queue, (time) => {
      console.log(time - startTime);
    });
  } else if (process.argv.indexOf('--add') > -1) {

    var properties = [
      {
        message: 'ENTER INTERACTIVE MODE? (Y/n)',
        name: 'decision', 
        validator: /^[y|n]+$/,
        warning: colors.red('Just say yes or no man (y,n)')
      }
    ];

    prompt.start();

    prompt.get(properties, function (err, result) {
      if (err) { 
        console.log(err);
        return 1;
      }
      if (result.decision === 'y') {
        console.log(colors.rainbow('\nYoU jUsT eNtErEd InTeRaCtIvE mOdE!!@@#$!!!'));
        console.log('Getting some random front page posts');

        randomKeys = [];
        for (var i = 0; i < 1; i++) {
          var randomSite = whiteListKeys[Math.floor(Math.random() * whiteListKeys.length)];
          if (randomKeys.indexOf(randomSite) < 0) {
            randomKeys.push(randomSite);
          }
        }

        console.log(randomKeys);

        frontPageCrawler.getPosts(randomKeys, (results) => {

          console.log('POSTS FROM FRONT PAGE:' + results.length);
          results = results.map(result => {
            return {
              url: result,
              parent: null
            };
          });
          scheduler.scheduleCrawlersInteractive(results, {interactive: true}, (time) => {
            console.log('You just did this for ' + (new Date() - startTime / (60 * 1000)) + ' minutes');
          });

        });

      } else {
        console.log(colors.magenta('Nevermind >:('));
        return 1;
      }
    });

  } else {
    frontPageCrawler.getPosts(whiteListKeys, (results) => {
      console.log('FRONT PAGE POSTS: ', results.length);
      frontPageCrawler.filterPosts(results, (filtered) => {
        console.log('FILTERED POSTS: ', filtered.length);
        // scheduler.scheduleCrawlers(filtered, null, (time) => {
        //   console.log(time - startTime);
        // });
        scheduler.scheduleCrawlersMulti(filtered, (time) => {
          console.log(time - startTime);
        });
      });
    });
  }
};
start();
module.exports = start;

