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
      COMPUTER_MAN: "https://www.youtube.com/watch?v=jeg_TJvkSjg", // Computer Man Easter Egg
      ERR:
        "\\❌ **|** An error occurred, please try again later\nIf the issue persists, contact support",

      // Kick
      COMMAND_KICK_DESCRIPTION: "Kicks a user",
      COMMAND_KICK_NOT: user =>
        `\\❌ **|** Unfortunately, I'm not able to kick \`${user.user.tag}\``,
      COMMAND_KICK_DONE: (user, reason) =>
        `\\👢 **|** \`${user.user.tag}\` has been booted from the server${
          reason ? ` for \`${reason}\`` : ``
        }`,

      // BAN
      COMMAND_BAN_DESCRIPTION: "Bans a user",
      COMMAND_BAN_EXTENDED:
        "Flags: --7d --1d (deletes their messages) --silent (doesn't log)",
      COMMAND_BAN_NOT: user =>
        `\\❌ **|** Unfortunately, I'm not able to ban \`${user.user.tag}\``,
      COMMAND_BAN_DONE: (userOrId, reason, days) =>
        `\\🔨 **|** \`${userOrId}\` was hit with the ban hammer${
          reason ? ` for \`${reason}\`` : ``
        }${
          days
            ? ` and their messages from the last ${
                days === 7 ? "7 days" : "24 hours"
              } were removed`
            : ``
        }`,

      // SOFTBAN
      COMMAND_SOFTBAN_DESCRIPTION:
        "Softbans a user (AKA deletes their messages from x days)",
      COMMAND_SOFTBAN_EXTENDED:
        "Flags: --7d\nIf no flags are specified the messages from the last 24 hours will be deleted instead",
      COMMAND_SOFTBAN_NOT: user =>
        `\\❌ **|** Unfortunately, I'm not able to softban \`${user.user.tag}\``,
      COMMAND_SOFTBAN_DONE: (user, reason, days) =>
        `\\🔨 **|** \`${
          user.user.tag
        }\` was hit with the ban hammer (but only slightly)${
          reason ? ` for \`${reason}\`` : ``
        } and their messages from the last ${
          days === 7 ? "7 days" : "24 hours"
        } were removed`,

      // TEMPBAN
      COMMAND_TEMPBAN_DESCRIPTION: "Tempbans a user",
      COMMAND_TEMPBAN_EXTENDED:
        "Flags: --7d --1d\nThe unban can be cancelled at anytime by using the cancelUnban command",
      COMMAND_TEMPBAN_NOT: user =>
        `\\❌ **|** Unfortunately, I'm not able to softban \`${user.user.tag}\``,
      COMMAND_TEMPBAN_DONE: (userOrId, reason, days, duration) =>
        `\\🔨 **|** \`${userOrId}\` was hit with the ban hammer (temporarily)${
          reason ? ` for \`${reason}\`` : ``
        }${
          days
            ? ` and their messages from the last ${
                days === 7 ? "7 days" : "24 hours"
              } were removed`
            : ``
        }, they'll be automatically unbanned in ${duration}`,

      // CANCELUNBAN
      RESOLVER_TEMPBANNEDUSER_INVALID:
        "You must insert a valid tempbanned user's id or their mention",

      COMMAND_CANCELUNBAN_DESCRIPTION: "Cancels the scheduled unban of a user",
      COMMAND_CANCELUNBAN_DONE: (user, reason) =>
        `\\🆑 **|** \`${user.tag}\`'s scheduled unban has been canceled${
          reason ? ` for \`${reason}\`` : ``
        }`,

      // UNBAN
      RESOLVER_BANNEDUSER_INVALID:
        "You must insert a valid banned user's id or their mention",

      COMMAND_UNBAN_DESCRIPTION: "Unbans a user",
      COMMAND_UNBAN_DONE: (user, reason) =>
        `\\✨ **|** \`${user.tag}\` has been unbanned${
          reason ? ` for \`${reason}\`` : ``
        }`,

      // PRUNE
      COMMAND_PRUNE_DESCRIPTION:
        "Deletes messages from a channel (up to 50 messages)",
      COMMAND_PRUNE_EXTENDED:
        "If the desired result is deleting all the messages from a channel, consider using pruneChannel instead",
      COMMAND_PRUNE_INVALID:
        "You must insert a valid amount of messages to delete (up to 50), if you want to clear the channel instead use the pruneChannel command",
      COMMAND_PRUNE_DONE: (messages, desired, channel) =>
        `\\🧨 **|** \`${messages.size}${
          messages.size !== desired ? `/${desired}` : ``
        }\` message${messages.size === 1 ? " has" : "s have"} been deleted`,

      // PRUNECHANNEL
      COMMAND_PRUNECHANNEL_DESCRIPTION: "Prunes all messages from a channel",
      COMMAND_PRUNECHANNEL_NOT: channel =>
        `\\❌ **|** Unfortunately, I'm not able to prune ${channel}`,
      COMMAND_PRUNECHANNEL_DONE: (user, oldCh, newCh) =>
        `\\🧨 **|** \`#${oldCh.name}\` has been pruned ||${user}||`,

      // ROLES
      RESOLVER_IMPROVEDROLE_INVALID:
        "You must insert a valid role ID, mention or name",

      ROLES_DESCRIPTION: roleType =>
        `Displays the current ${roleType} role or sets it to a new one`,
      ROLES_NO_PERM: roleType =>
        `\\❌ **|** Sorry, you don't have permission to change the ${roleType} role`,
      ROLES_DONE: (roleType, role) =>
        `\\🎭 **|** The new ${roleType} role has been set to \`${role.name} (${role.id})\``,
      ROLES_RESET: roleType => `\\🎭 **|** The ${roleType} role has been reset`,
      ROLES_VIEW: (roleType, role) =>
        `\\🎭 **|** The current ${roleType} role is \`${role.name} (${role.id})\``,
      ROLES_NOT_DEFINED: roleType =>
        `\\❌ **|** No ${roleType} role has been setup`,
      ROLES_REQUIRED: (roleType, setupCommand) =>
        `\\❌ **|** The ${roleType} role must be setup in order to use this command, to set it up run ${setupCommand ||
          roleType}`,

      // MUTEDROLE
      COMMAND_MUTEDROLE_EXTENDED:
        "Flags: --manual (doesn't create permissions for the role automatically)"
    };
  }
  public async init(): Promise<void> {
    await super.init();
  }
}
