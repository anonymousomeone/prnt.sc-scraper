const got = require('got');
const jsdom = require("jsdom");
const download = require('image-downloader')
const readline = require('readline');
const URL = require('url').URL;
const { JSDOM } = jsdom;

const options = { headers: { 'User-Agent': 'Mozilla/4.0' } }

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function code() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  var random = Math.floor(Math.random() * 2)
  if (random == 0) {
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return Math.floor(Math.random() * 10)
}

function rand() {
  var thing = ''
  for (var a = 0; a < 6; a++) {
    thing += code()
  }
  return thing
}

function downloadImage(url, filepath) {
  if (!stringIsAValidUrl(url)) {return console.log('bad url')}
  try{
    return download.image({
       url,
       dest: filepath 
    });
  } catch(err){
    console.log('something went wrong (probably nothing)')
  }
}

async function scrape(reps){
  for (var i = 0; i < reps; i++) {
    var id = rand()
    var url = ('http://prnt.sc/' + id)
    got(url, options).then(response => {
      const dom = new JSDOM(response.body);
      var document = dom.window.document;
      var image = document.getElementById('screenshot-image')
      var src = image.src;
      downloadImage(src, './scraped')
      console.log(((i + 1) + '/' + reps) + ' scraped, ' + src + ' (' + url + ')')
    }).catch(() => {
      console.log('something went wrong');
    });
    var wait = 4000 + Math.floor(Math.random() * 1000) // dont edit too much or cloudflare will block your ip (speaking from experince)
    await sleep(wait)
  }
}

rl.question('how many reps??? ', function (answer) {
  var reps = parseInt(answer)
  scrape(reps)
  rl.close()
})
