module.exports = class Embed {
    constructor(json) {
        this.json = json ? json : {}
        if (!json) this.json.embed = {};
    }

    /**
     * Adds a normal message to the embed.
     * @param {String} data 
     */
    setMessage(data) {
        if (data) this.json.content = data;
        return this;
    }

    /**
     * Sets the Embeds color
     * @param {String} hex  
     */
    setColor(hex) {
        if (hex) this.json.embed.color = parseInt(hex.replace('#', ''), 16);
        return this;
    }
    /**
     * Sets the Embeds title
     * @param {String} title
     */
    setTitle(title) {
        if (title) this.json.embed.title = title;
        return this;
    }
    /**
     * Sets the Embeds description
     * @param {String} desc 
     */
    setDescription(desc) {
        if (desc) this.json.embed.description = desc;
        return this;
    }
    /**
     * Sets the Embeds timestamp
     * @param {Date} date 
     */
    setTimestamp(date) {
        if (date) this.json.embed.timestamp = date.toISOString();
        return this;
    }
    /**
     * Sets url for the title
     * @param {String} url 
     */
    setUrl(url) {
        if (url) this.json.embed.url = url;
        return this;
    }
    /**
     * Sets footer for the embed
     * @param {Object} footer 
     */
    setFooter(footer) {
        if (!this.json.embed.footer && (footer.text || footer.icon)) this.json.embed.footer = {}
        if (footer.text) this.json.embed.footer.text = footer.text
        if (footer.icon) this.json.embed.footer.icon_url = footer.icon
        return this;
    }
    /**
     * Sets author for the embed
     * @param {Object} author 
     */
    setAuthor(author) {
        if (!this.json.embed.author && (author.name || author.icon || author.url)) this.json.embed.author = {}
        if (author.name) this.json.embed.author.name = author.name
        if (author.icon) this.json.embed.author.icon_url = author.icon
        if (author.url) this.json.embed.author.url = author.url
        return this;
    }
    /**
     * Adds a field to the embed
     * @param {Object} field 
     */
    addField(field) {
        if (!this.json.embed.fields) this.json.embed.fields = []
        this.json.embed.fields.push(field)
        return this;
    }
    /**
     * Sets thumbnail for the embed
     * @param {String} image_url 
     */
    setThumbnail(image_url){
        if(!this.json.embed.thumbnail) this.json.embed.thumbnail = {}
        this.json.embed.thumbnail.url = image_url
        return this;
    }
    /**
     * Sets image for the embed
     * @param {String} image_url 
     */
    setImage(image_url){
        if(!this.json.embed.image) this.json.embed.image = {}
        this.json.embed.image.url = image_url
        return this;
    }
    /**
     * Returns the json for the whole embed
     * @returns {Object}
     */
    getJson() {
        return this.json;
    }
}