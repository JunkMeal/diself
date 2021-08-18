export class Client {
    settings: {
        user_agent: string;
        x_super: string;
        api_url: string;
    };
    start(token: string): void;
    sendMessage(message: string, channel_id_: string): Message;
    on(event: "MESSAGE_CREATE", listener: (message: Message) => void): this;
    once(event: "READY", listener: () => void): this;
    on(event: "MESSAGE_REACTION_ADD", listener: (reaction: Reaction) => void): this;
    request(method: string, path: string, data: object, externalHeaders: object): string;
}

export class Message {
    tts: boolean;
    timestamp: Date;
    referenced_message?: Message;
    pinned: boolean;
    mentions: object[];
    mention_roles: string[];
    mention_everyone: boolean;
    id: string;
    flags: number;
    embeds: Embed[];
    content: string;
    components: object[];
    channel: {
        id: string;
        send(message: string): Message;
    };
    author: object;
    attachments: object[];
    delete(): void;
    react(reaction: string): void;
}

export class Embed {
    constructor(json: object);
    setMessage(message: string): Embed;
    setColor(hex: string): Embed;
    setTitle(title: string): Embed;
    setDescription(description: string): Embed;
    setTimestamp(date: Date): Embed;
    setUrl(url: string): Embed;
    setFooter(footer: { text: string; icon: string }): Embed;
    setAuthor(author: { name: string; icon: string; url: string }): Embed;
    addField(field: { name: string; value: string; inline: boolean }): Embed;
    setThumbnail(image_url: string): Embed;
    setImage(image_url: string): Embed;
    getJson(): object;
}

export class Reaction {
    user_id: string;
    message_id: string;
    channel: {
        id: string;
        send(message: string): Message;
    };
    emoji: { name: string; id: string | null; full: string };
}
