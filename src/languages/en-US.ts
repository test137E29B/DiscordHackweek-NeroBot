import { Language, KlasaClient, LanguageStore } from "klasa";

export default class extends Language {
  public constructor(
    client: KlasaClient,
    store: LanguageStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir);
    this.language = {
      // Add Language keys in here
      TEST: "This is a test",
      ERR:
        "\\❌ **|** An error occurred, please try again later\nIf the issue persists, contact support",

      // Kick
      COMMAND_KICK_DESCRIPTION: "Kicks a user",
      COMMAND_KICK_NOT: (user): string =>
        `\\❌ **|** Unfortunately, I'm not able to kick \`${user.user.tag}\``,
      COMMAND_KICK_DONE: (user, reason): string =>
        `\\👢 **|** \`${user.user.tag}\` has been booted from the server${
          reason ? ` for \`${reason}\`` : ``
        }`,

      // BAN
      COMMAND_BAN_DESCRIPTION: "Bans a user",
      COMMAND_BAN_NOT: (user): string =>
        `\\❌ **|** Unfortunately, I'm not able to ban \`${user.user.tag}\``,
      COMMAND_BAN_DONE: (user, reason, days): string =>
        `\\🔨 **|** \`${user.user.tag}\` was hit with the ban hammer${
          reason ? ` for \`${reason}\`` : ``
        }${days` and their messages from the last ${
          days === 7 ? "7 days" : "24 hours"
        } were removed```}`
    };
  }

  public async init(): Promise<void> {
    await super.init();
  }
}
