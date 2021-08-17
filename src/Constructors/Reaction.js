const Message = require("./Message.js")
module.exports = class Reaction {
    constructor(r,client){
        this.user_id = r.user_id
        this.message_id = r.message_id
        this.emoji = r.emoji
        this.channel = {
            id:r.channel_id,
            send: async (message) => {
                return new Message(await client.sendMessage(message,m.channel_id), client)
            } 
        }
        this.emoji.full = r.emoji.id ? `<:${this.emoji.name}:${this.emoji.id}>` : this.emoji.name
    }
}