module.exports = (client) => {
  client.commands = new Map();
  const commandFiles = require("fs")
    .readdirSync(__dirname+"/commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(file.replace(".js",""), command.execute);
  }
};
