const { Embed } = require("../../src");
module.exports = {
    execute: async (message) => {
        let embed = new Embed().setTitle("🖍️ Edit me!").setColor("#36393f");
        let m = await message.channel.send({ embed });

        setTimeout(async () => {
            embed.setTitle("🖍️ Edited!")
            await m.edit({ embed});
        }, 3000)
    },
};
