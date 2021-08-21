module.exports = {
    execute: async (message, args) => {
        if (!args[0]) return message.react("❌");
        await message.react(args[0]);
    },
};
