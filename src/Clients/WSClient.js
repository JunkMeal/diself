const EventEmitter = require("events").EventEmitter;
const Message = require("../Constructors/Message.js");
const Reaction = require("../Constructors/Reaction.js");
const zlib = require("zlib-sync");

class WSClient extends EventEmitter {
    constructor(gateway, compression) {
        super();
        this.gateway = gateway;
        this.compression = compression;
        if (this.compression)
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                flush: zlib.Z_SYNC_FLUSH,
                to: "json",
            });
    }
    start(token, client) {
        const WS = require("ws");
        const ws = new WS(this.gateway);
        console.log(this.gateway);
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
                if (this.compression) {
                    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
                    const l = data.length;
                    const flush = l >= 4 && data[l - 4] === 0x00 && data[l - 3] === 0x00 && data[l - 2] === 0xff && data[l - 1] === 0xff;

                    this.inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
                    if (!flush) return;
                    data = this.inflate.result;
                }
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
