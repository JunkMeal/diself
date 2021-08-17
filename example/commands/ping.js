const { Embed } = require("../../src")
module.exports = {
    execute: async (message, args, client) => {
        message.delete();
        let embed = new Embed()
        .setTitle("🏓 Pong!")
        .setColor("#36393f")
		let m = await message.channel.send(embed);
        setTimeout(async () => {
            await m.delete();
        }, 3000)
    }
}