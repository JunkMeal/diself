const { EventEmitter } = require("events");
module.exports = class ReactionCollector extends EventEmitter {
    constructor(message, filter, options = {}) {
        super();
        this.end = false;
        this.client = message.client;
        this.filter = filter;
        this.callback = (reaction) => {
            if (reaction.message_id !== message.id) return;
            if (this.filter(reaction.user_id)) {
                return this.emit("collect", reaction);
            }
        };
        this.client.on("MESSAGE_REACTION_ADD", this.callback);

        if (options.time) {
            setTimeout(() => {
                if (this.end) return;
                this.client.removeListener("MESSAGE_REACTION_ADD", this.callback);
                this.emit("end");
            }, options.time);
        }
    }
};
