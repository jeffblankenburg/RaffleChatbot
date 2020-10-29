const tmi = require("tmi.js");
var Airtable = require('airtable');
const keys = require("./keys.js");
const data = require("./data");
const helper = require("./helper");

const identity = require("./identity.js");

// Create a client with our options
const client = new tmi.client(identity);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

async function onMessageHandler(target, context, msg, self) {
  if (self || ['chatsino', 'nightmareassistant'].includes(context.username)) { return;} // Ignore messages from the bot
  console.log({target});
  console.log({context});
  console.log({msg});
  console.log({self});

  const username = context.username;
  const userId = context["user-id"];
  const messageType = context["message-type"];

  //console.log({username});

  if (msg === "!raffle" && context.username === "jeffblankenburg") {
    client.say(target, `GETTING THE RAFFLE WINNER FOR TODAY...`);

    const raffleEntries = await data.getEntriesForToday();
    let uniqueEntries = [];
    for (let i = 0;i<raffleEntries.length;i++) {
      if (!uniqueEntries.includes(raffleEntries[i].fields.Username)) {
        uniqueEntries.push(raffleEntries[i].fields.Username);
      }
    }

    const random = helper.getRandomItem(uniqueEntries);
    client.say(target, `TODAY'S RAFFLE WINNER IS @${random}`);

  }
  else {
    var base = new Airtable({apiKey: keys.airtable_api_key}).base(keys.airtable_base_data);

    base('Messages').create({"Username": username, "Message": msg, "Channel": target}, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
      //console.log(record.getId());
    });

    const entries = await data.getEntriesByUser(username);
    if (entries.length === 1) {
      client.say(target, `@${context.username} has been entered into today's raffle.`);
    }
  }

  //console.log({entries});



  //TODO: MAKE SURE TO WHISPER BACK WHEN IT'S A WHISPER.
  //
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  client.say("jeffblankenburg", "Raffle Chatbot is operational."); 
  //client.say("chatsino", "PLACE YOUR BETS!  The CHATsino is open!");
}
