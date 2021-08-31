module.exports = {
    execute: async (message) => {
        let search = await message.channel.search({ content: "test" });
        console.log(JSON.stringify(search, null, 2));
    },
};
