const Embed = require("../Constructors/Embed.js");
module.exports = class Message {
    constructor(message, client) {
        this.tts = message.tts;
        this.timestamp = new Date(message.timestamp);
        if (message.referenced_message) this.referenced_message = new Message(message.referenced_message, client);
        this.pinned = message.pinned;
        this.mentions = message.mentions;
        this.mention_roles = message.mention_roles;
        this.mention_everyone = message.mention_everyone;
        this.id = message.id;
        this.flags = message.flags;
        this.embeds = [];
        for (const embed of message.embeds) this.embeds.push(embed);
        if (message.edited_timestamp) this.edited_timestamp = message.edited_timestamp;
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
                return await client.sendMessage(message, this.channel.id);
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
