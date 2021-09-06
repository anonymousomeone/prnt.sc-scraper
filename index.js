const got = require('got');
const jsdom = require("jsdom");
const URL = require('url').URL;
const { Client, MessageEmbed, Intents } = require('discord.js');
const { token, ownerID, prefix } = require('./config.json');
const { JSDOM } = jsdom;

const options = { headers: { 'User-Agent': 'Mozilla/5.0' } }

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

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

async function spam(message) {
  while (true) {
    var id = rand()
    var url = ('http://prnt.sc/' + id)
    got(url, options).then(response => {
      const dom = new JSDOM(response.body);
      var document = dom.window.document;
      var image = document.getElementById('screenshot-image')
      var src = image.src;
      if (!stringIsAValidUrl(src)) {return;}
      console.log(url + ' ' + src)
      const embed = new MessageEmbed()
      .setTitle('prnt.sc random image')
      .setURL(url)
      .setImage(src)
    message.channel.send(embed)
    })

    var wait = 4000 + Math.floor(Math.random() * 1000) // dont edit too much or cloudflare will block your ip (speaking from experince)
    await sleep(wait)
  }
}

// Create a new client instance
const client = new Client();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command == 'spam' && message.author.id == ownerID) {
    spam(message)
  }
})

// Login to Discord with your client's token
client.login(token);
