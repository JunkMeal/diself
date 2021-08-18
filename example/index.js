require("dotenv").config();
const diself = require("../src");
const client = new diself.Client();

// Load commands
require("./loader.js")(client);

client.once("READY", () => {
    console.log(client.user);
});

client.on("MESSAGE_CREATE", async (message) => {
    // Check if message is not sent by someone else
    if (message.author.id !== client.user.id) return;
    // Check prefix
    if (!message.content.startsWith(process.env.prefix)) return;
    // Split arguments
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    // Get the command
    const command = args.shift().toLowerCase();
    // Check if command exists
    if (!client.commands.has(command)) return;
    try {
        // Execute command
        await client.commands.get(command)(message, args, client);
    } catch (error) {
        let m = await message.channel.send("There was an error while executing this command!");
        setTimeout(async () => {
            await m.delete();
        }, 3000);
    }
});

// Start selfbot
client.start(process.env.token);
