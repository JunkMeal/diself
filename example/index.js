const diself = require("../src");
const client = new diself.Client();
const config = require("./config.json");

// Load commands
require("./loader.js")(client);

client.once("READY", () => {
  console.log(client.user);
});

// Start selfbot
client.start(config.token);
