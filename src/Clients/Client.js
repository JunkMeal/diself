const EventEmitter = require("events").EventEmitter;
const WSClient = require("./WSClient.js");
const axios = require("axios").default;
const Message = require("../Constructors/Message.js");

module.exports = class Client extends EventEmitter {
  constructor() {
    super();
    let user_agent =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36";
    let x_super = Buffer.from(
      `{"os":"Linux","browser":"Chrome","device":"","system_locale":"en-US","browser_user_agent":"${user_agent}","browser_version":"90.0.4430.212","os_version":"","referrer":"","referring_domain":"","referrer_current":"","referring_domain_current":"","release_channel":"stable","client_build_number":85712,"client_event_source":null}`
    ).toString("base64");
    this.settings = {
      user_agent,
      x_super,
      api_url: "https://discord.com/api/v9/",
    };
  }

  /**
   * Starts the selfbot
   * @param {String} token
   */
  start(token) {
    this.settings.token = token;
    const ws = new WSClient("wss://gateway.discord.gg/?encoding=json&v=9");
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
      console.log(error);
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
      console.log(error);
      throw new Error("Request failed");
    });
    return res;
  };

  /**
   * Sents a Message to a channel
   * @param {String} message
   * @param {String} channelid
   * @returns {Message}
   */
  sendMessage = async (message, channelid) => {
    let data;
    if (typeof message == "string") data = { content: message };
    if (typeof message == "object") data = message;
    if (message?.constructor.name == "Embed") data = message.getJson();
    if (!data) throw new Error("Invalid Message");
    let req = await this.request(
      "POST",
      `channels/${channelid}/messages`,
      data
    );
    return req;
  };
};
