module.exports = {
    execute: async (message, args, client) => {
        if (!args[0]) return message.react("❌");
        await message.react(args[0]);
    },
};
