const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const download = require('image-downloader')
const { JSDOM } = jsdom;

const options = { headers: { 'User-Agent': 'Mozilla/4.0' } }

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function rand() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    var str = alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)]
    return str + Math.floor(Math.random() * 10000);
}

function downloadImage(url, filepath) {
    return download.image({
       url,
       dest: filepath 
    });
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
      console.log('scraped ' + src)
    }).catch(err => {
      console.log(err);
    });
    var wait = 4000 + Math.floor(Math.random() * 1000)
    console.log(wait)
    await sleep(wait)
  }
}

var reps = 100
scrape(reps)
