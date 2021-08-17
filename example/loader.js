module.exports = (client) => {
  const config = require("./config.json");
  client.commands = new Map();
  const commandFiles = require("fs")
    .readdirSync(__dirname+"/commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(file.replace(".js",""), command.execute);
  }

  client.on("MESSAGE_CREATE", async (message) => {
    // Check if message is not sent by someone else
    if (message.author.id !== client.user.id) return;
    // Check prefix
    if (!message.content.startsWith(config.prefix)) return;
    // Split arguments
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    // Get the command
    const command = args.shift().toLowerCase();
    // Check if command exists
    if (!client.commands.has(command)) return;
    try {
      // Execute command
      await client.commands.get(command)(message, args, client);
    } catch (error) {
      let m = await message.channel.send(
        "There was an error while executing this command!"
      );
      setTimeout(async () => {
        await m.delete();
      }, 3000);
    }
  });
};
