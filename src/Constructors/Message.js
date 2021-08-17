module.exports = class Message {
    constructor(m, client){
       this.tts = m.tts
       this.timestamp = new Date(m.timestamp)
       if(m.referenced_message) this.referenced_message = m.referenced_message
       this.pinned = m.pinned
       this.mentions = m.mentions
       this.mention_roles = m.mention_roles
       this.mention_everyone = m.mention_everyone
       this.id = m.id
       this.flags = m.flags
       this.embeds = m.embeds
       if(m.edited_timestamp) this.edited_timestamp = m.edited_timestamp
       this.content = m.content
       this.components = m.components
       this.channel = {
       id: m.channel_id,
       /**
        * Sends a message to the message channel
        * @param {String} message 
        * @returns {Message}
        */
       send: async (message) => {
            return new Message(await client.sendMessage(message,m.channel_id), client)
        } 
    }
        this.author = m.author
        this.attachments = m.attachments,
        /**
         * Deletes the message.
         */
        this.delete = async () => {
            await client.request("DELETE",`channels/${this.channel.id}/messages/${this.id}`)
        },
        /**
         * Reacts to the message
         * @param {String} reaction 
         */
        this.react = async (reaction) => {
            await client.request("PUT",`channels/${this.channel.id}/messages/${this.id}/reactions/${encodeURIComponent(reaction)}/@me`)
        }
    }
}
