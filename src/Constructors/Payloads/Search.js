module.exports = class Search {
    constructor(search) {
        search.authorId && (this.author_id = search.authorId);
        search.content && (this.content = search.content);
        search.mentions && (this.mentions = search.mentions);
        search.has && (this.has = search.has);
        search.maxId && (this.max_id = search.maxId);
        search.minId && (this.min_id = search.minId);
        search.channelId && (this.channel_id = search.channelId);
    }
};
