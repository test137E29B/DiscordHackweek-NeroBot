import {
  EmbedField,
  MessageEmbed,
  ColorResolvable,
  MessageAttachment,
  FileOptions
} from "discord.js";

export interface IEmbedOptions {
  author?: {
    name: string;
    url?: string;
    iconURL?: string;
  };
  color?: ColorResolvable;
  description?: string;
  fields?: EmbedField[];
  files?: (MessageAttachment | string | FileOptions)[];
  footer?: { text?: string; iconURL?: string; proxyIconURL?: string };
  image?: string;
  provider?: { name: string; url: string };
  thumbnail?: string;
  timestamp?: number | Date;
  title?: string;
  url?: string;
}

class BaseEmbed {
  public constructor(
    protected color: ColorResolvable,
    protected options: IEmbedOptions
  ) {}

  public create(): MessageEmbed {
    // Create Embed and add color
    const embed = new MessageEmbed().setColor(this.color);
    this.setOptions(embed);
    return embed;
  }

  public setOptions(embed: MessageEmbed): MessageEmbed {
    // Author
    if (this.options.author)
      embed.setAuthor(
        this.options.author.name,
        this.options.author.iconURL,
        this.options.author.url
      );

    // Color
    if (this.options.color) embed.setColor(this.options.color);

    // Description
    if (this.options.description)
      embed.setDescription(this.options.description);

    // Fields
    if (this.options.fields) {
      for (const field of this.options.fields)
        embed.addField(field.name, field.value, field.inline);
    }

    // Files
    if (this.options.files) embed.attachFiles(this.options.files);

    // Footer
    if (this.options.footer) embed.setFooter(this.options.footer);

    // Image
    if (this.options.image) embed.setImage(this.options.image);

    // Thumbnail
    if (this.options.thumbnail) embed.setThumbnail(this.options.thumbnail);

    // Timestamp
    if (this.options.timestamp) embed.setTimestamp(this.options.timestamp);

    // Title
    if (this.options.title) embed.setTitle(this.options.title);

    // URL
    if (this.options.url) embed.setURL(this.options.url);

    return embed;
  }
}

export class InformationEmbed extends BaseEmbed {
  public constructor(options: IEmbedOptions) {
    super("#2196f3", options);
  }
}

export class SuccessEmbed extends BaseEmbed {
  public constructor(options: IEmbedOptions) {
    super("#8bc34a", options);
  }
}

export class ErrorEmbed extends BaseEmbed {
  public constructor(options: IEmbedOptions) {
    super("#f44336", options);
  }
}
