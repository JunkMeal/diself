const EventEmitter = require("events").EventEmitter;
const WSClient = require("./WSClient.js");
const axios = require("axios").default;
const Message = require("../Constructors/Message.js");
const FormData = require("form-data");
var _ = require("lodash");
const fs = require("fs");

module.exports = class Client extends EventEmitter {
    constructor(settings) {
        if (!settings) settings = {};
        if (settings.compression === false) settings.compression = false;
        else settings.compression = true;
        super();
        let user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9002 Chrome/83.0.4103.122 Electron/9.3.5 Safari/537.36";
        let x_super = Buffer.from(
            `"{ os: "Windows", browser: "Discord Client", release_channel: "stable", client_version: "1.0.9002", os_version: "10.0.19042", os_arch: "x64", system_locale: "en-US", client_build_number: 91948, client_event_source: null, }"`
        ).toString("base64");
        this.settings = {
            user_agent,
            x_super,
            api_url: "https://discord.com/api/v9/",
            compression: settings.compression,
        };
    }

    /**
     * Starts the selfbot
     * @param {String} token
     */
    start(token) {
        this.settings.token = token;
        const ws = new WSClient(`wss://gateway.discord.gg/?encoding=json&v=9${this.settings.compression ? "&compress=zlib-stream" : ""}`, this.settings.compression);
        ws.start(token, this);
        ws.on("READY", (user) => {
            this.user = user;
            this.emit("READY");
        });
        ws.on("MESSAGE_CREATE", (message) => this.emit("MESSAGE_CREATE", message));
        ws.on("MESSAGE_REACTION_ADD", (reaction) => this.emit("MESSAGE_REACTION_ADD", reaction));
    }

    /**
     * Requests to the discord api
     * @param {String} method
     * @param {String} path
     * @param {Object} data
     * @param {Object} externalHeaders
     * @returns {String} response data
     */
    request = async (method, path, data, externalHeaders) => {
        delete axios.defaults.headers.common["Accept"];
        let options = {};
        options.method = method;
        options.url = this.settings.api_url + path;
        options.headers = {
            "user-agent": this.settings.user_agent,
            authorization: this.settings.token,
            "x-super-properties": this.settings.x_super,
        };
        if (externalHeaders) Object.assign(options.headers, externalHeaders);
        data ? (options.data = data) : null;
        let res = await axios(options).catch((error) => {
            console.error(error);
            throw new Error("Request failed");
        });
        return res.data;
    };
    /**
     * Request any url
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} headers
     * @returns {Response}
     */
    betterRequest = async (method, url, data, headers) => {
        delete axios.defaults.headers.common["Accept"];
        let options = {};
        options.method = method;
        options.url = url;
        options.headers = headers;
        data ? (options.data = data) : (options.data = null);
        let res = await axios(options).catch((error) => {
            console.error(error);
            throw new Error("Request failed");
        });
        return res;
    };

    /**
     * Sents a Message to a channel
     * @param {Object} message
     * @param {String} channel_id
     * @returns {Message}
     */
    sendMessage = async (message, channel_id) => {
        let data = {};
        if (message.content) data.content = message.content;
        if (message.embed) data.embed = message.embed.json;
        if (message.file) {
            let stream = await this.#getStream(message.file);
            const form = new FormData();
            form.append("file", stream);
            form.append("payload_json", JSON.stringify(_.isEmpty(data) ? { content: "" } : data));

            let req = await this.request("POST", `channels/${channel_id}/messages`, form, form.getHeaders());
            return new Message(req, this);
        }
        if (!data) throw new Error("Invalid Message");
        let req = await this.request("POST", `channels/${channel_id}/messages`, data);
        return new Message(req, this);
    };

    #getStream = async (path) => {
        if (path?.constructor?.name === "ReadStream" || path?.constructor?.name === "Buffer") return path;
        if (path.startsWith("http")) {
            let res = await axios.get(path, { responseType: "stream" });
            return res.data;
        }
        return fs.createReadStream(path);
    };
};
