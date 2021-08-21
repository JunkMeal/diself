const { ReactionCollector } = require("../../src");
module.exports = {
    execute: async (message) => {
        let collector = new ReactionCollector(message, (userId) => userId === message.author.id, { time: 10000 });
        collector.on("collect", (reaction) => {
            message.channel.send({ content: reaction.emoji.full });
        });
        collector.on("end", () => {
            message.channel.send({ content: "Collector ended" });
        });
    },
};
