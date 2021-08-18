module.exports = class Reaction {
    constructor(reaction, client) {
        this.user_id = reaction.user_id;
        this.message_id = reaction.message_id;
        this.emoji = reaction.emoji;
        this.channel = {
            id: reaction.channel_id,
            send: async (message) => {
                return await client.sendMessage(message, reaction.channel_id);
            },
        };
        this.emoji.full = reaction.emoji.id ? `<:${this.emoji.name}:${this.emoji.id}>` : this.emoji.name;
    }
};
