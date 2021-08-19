module.exports = class Embed {
    constructor(json) {
        this.json = json ? json : {};
    }

    /**
     * Sets the Embeds color
     * @param {String} hex
     */
    setColor(hex) {
        if (hex) this.json.color = parseInt(hex.replace("#", ""), 16);
        return this;
    }
    /**
     * Sets the Embeds title
     * @param {String} title
     */
    setTitle(title) {
        if (title) this.json.title = title;
        return this;
    }
    /**
     * Sets the Embeds description
     * @param {String} description
     */
    setDescription(description) {
        if (desc) this.json.description = description;
        return this;
    }
    /**
     * Sets the Embeds timestamp
     * @param {Date} date
     */
    setTimestamp(date) {
        if (date) this.json.timestamp = date.toISOString();
        return this;
    }
    /**
     * Sets url for the title
     * @param {String} url
     */
    setUrl(url) {
        if (url) this.json.url = url;
        return this;
    }
    /**
     * Sets footer for the embed
     * @param {Object} footer
     */
    setFooter(footer) {
        if (!this.json.footer && (footer.text || footer.icon)) this.json.footer = {};
        if (footer.text) this.json.footer.text = footer.text;
        if (footer.icon) this.json.footer.icon_url = footer.icon;
        return this;
    }
    /**
     * Sets author for the embed
     * @param {Object} author
     */
    setAuthor(author) {
        if (!this.json.author && (author.name || author.icon || author.url)) this.json.author = {};
        if (author.name) this.json.author.name = author.name;
        if (author.icon) this.json.author.icon_url = author.icon;
        if (author.url) this.json.author.url = author.url;
        return this;
    }
    /**
     * Adds a field to the embed
     * @param {Object} field
     */
    addField(field) {
        if (!this.json.fields) this.json.fields = [];
        this.json.fields.push(field);
        return this;
    }
    /**
     * Sets thumbnail for the embed
     * @param {String} image_url
     */
    setThumbnail(image_url) {
        if (!this.json.thumbnail) this.json.thumbnail = {};
        this.json.thumbnail.url = image_url;
        return this;
    }
    /**
     * Sets image for the embed
     * @param {String} image_url
     */
    setImage(image_url) {
        if (!this.json.image) this.json.image = {};
        this.json.image.url = image_url;
        return this;
    }
};
