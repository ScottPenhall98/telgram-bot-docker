const Telebot = require('telebot');
const { networkInterfaces } = require('os');
require('dotenv').config();


const bot = new Telebot({
  token: process.env.BOT_TOKEN//"1472224236:AAFZmd7PWcMreWV1J-mBjl8akT6NSWAjbTU",
})

bot.on(["/start"], (msg) => {
  //all the information about user will come with the msg
  console.log(msg);
  bot.sendMessage(msg.from.id,"We're live");
});

bot.on(["/ip"], (msg) => {
  const nets = networkInterfaces();
  //return the IP of the
  const results = Object.create(null); // or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }

        results[name].push(net.address);
      }
    }
  }
  //Ubuntu results['enp4s0']
  bot.sendMessage(msg.from.id, "IP address is: " + JSON.stringify(nets));
});

bot.on(["/transfer"], (msg) => {
  //ssh onto the raspberry pi
  //run shell script
  bot.sendMessage(msg.from.id, "Started Transfer");
  //this wont return as we need to setup some sort of Async function
  let text = libreelec_connect([
    './transferFiles.sh',
  ]);
  bot.sendMessage(msg.from.id, text);
  bot.sendMessage(msg.from.id, "Transfer Successful");
})

function libreelec_connect (allCommands){
  var host = {
    server: {
      host: "192.168.0.104",
      userName: process.env.USER,
      password: process.env.PASSWORD,
    },
    commands: allCommands
  };

  var SSH2Shell = require('ssh2shell'),
    //Create a new instance passing in the host object
    SSH = new SSH2Shell(host),
    //Use a callback function to process the full session text
    callback = function (sessionText) {
      return sessionText;
    }

//Start the process
  SSH.connect(callback);
}

bot.start();