const Search = require("./Payloads/Search.js");
module.exports = class Message {
    constructor(message, client) {
        this.client = client;
        this.tts = message.tts;
        this.timestamp = new Date(message.timestamp);
        message.referenced_message && (this.referenced_message = new Message(message.referenced_message, client));
        this.pinned = message.pinned;
        this.mentions = message.mentions;
        this.mention_roles = message.mention_roles;
        this.mention_everyone = message.mention_everyone;
        this.id = message.id;
        this.flags = message.flags;
        this.embeds = [];
        for (const embed of message.embeds) this.embeds.push(embed);
        message.edited_timestamp && (this.edited_timestamp = message.edited_timestamp);
        this.content = message.content;
        this.components = message.components;
        this.channel = {
            id: message.channel_id,
            /**
             * Sends a message to the message channel
             * @param {String} message
             * @returns {Message}
             */
            send: async (message) => {
                return client.sendMessage(message, this.channel.id);
            },
            search: async (search) => {
                search = new Search(search);
                if (search.content) search.content = encodeURIComponent(search.content);
                let params = new URLSearchParams(search);
                console.log(params.toString().replace(/%2520/g, "%20"));
                let res = await client.request("GET", `channels/${this.channel.id}/messages/search?${params.toString().replace(/%2520/g, "%20")}`);
                if (res.retry_after) {
                    await require("util").promisify(setTimeout)(res.retry_after);
                    return this.channel.search(search);
                } else return res;
            },
        };
        this.author = message.author;
        this.attachments = message.attachments;
        /**
         * Deletes the message.
         */
        this.delete = async () => {
            await client.request("DELETE", `channels/${this.channel.id}/messages/${this.id}`);
        };
        /**
         * Reacts to the message
         * @param {String} reaction
         */
        this.react = async (reaction) => {
            await client.request("PUT", `channels/${this.channel.id}/messages/${this.id}/reactions/${encodeURIComponent(reaction)}/@me`);
        };
    }
};
