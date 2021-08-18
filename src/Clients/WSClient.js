const EventEmitter = require("events").EventEmitter;
const Message = require("../Constructors/Message.js");
const Reaction = require("../Constructors/Reaction.js");

class WSClient extends EventEmitter {
    constructor(gateway) {
        super();
        this.gateway = gateway;
    }
    start(token, client) {
        const WS = require("ws");
        const ws = new WS(this.gateway);
        ws.on("open", function open() {
            let data = {
                op: 2,
                d: {
                    properties: {
                        os: "Linux",
                        browser: "Chrome",
                    },
                    token,
                },
                compress: false,
            };

            ws.send(JSON.stringify(data));
        });
        ws.on(
            "message",
            function incoming(data) {
                data = JSON.parse(data);
                if (data.s) this.sequence = data.s;
                if (data.op == 11) {
                    //recieved HeartBeat
                    this.emit("heartbeat", {
                        sequence: this.sequence,
                        interval: this.heartbeat,
                    });
                }
                if (data.op == 10) {
                    //hello
                    this.heartbeat = data.d.heartbeat_interval;
                    this.interval = setInterval(() => {
                        ws.send(
                            JSON.stringify({
                                op: 1,
                                d: this.sequence,
                            })
                        );
                    }, data.d.heartbeat_interval);
                }

                switch (data.t) {
                    case "READY":
                        this.emit("READY", data.d.user);
                        break;
                    case "MESSAGE_CREATE":
                        this.emit("MESSAGE_CREATE", new Message(data.d, client));
                        break;
                    case "MESSAGE_REACTION_ADD":
                        this.emit("MESSAGE_REACTION_ADD", new Reaction(data.d, client));
                        break;
                }
            }.bind(this)
        );
    }
}
module.exports = WSClient;
