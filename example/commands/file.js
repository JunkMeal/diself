const { Embed } = require("../../src");
module.exports = {
    execute: async (message) => {
        message.delete();
        let embed = new Embed().setTitle("📁 File!").setColor("#36393f");
        message.channel.send({ embed, content: "File!", file: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" });
    },
};
