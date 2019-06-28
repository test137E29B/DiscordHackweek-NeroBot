import { Function } from "@kcp/functions";
import { Guild } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";
import { KlasaMessage } from "klasa";
import { NeroModAction } from "../lib/structures/schemas/guildSchema";

export default class extends Function {
  async run({
    msg,
    action,
    user,
    guild
  }: {
    msg: KlasaMessage;
    action: NeroModAction;
    user: KlasaMember;
    guild: Guild;
  }) {
    const func = [
      "ban",
      "softBan",
      "tempBan",
      "kick",
      "deleteMsg",
      "warn",
      "mute"
    ][action.action];

    if (action.ignoreStaff && (await msg.hasAtLeastPermissionLevel(2)))
      return false;

    return Boolean(
      // @ts-ignore
      await this.client.funcs[func]({
        msg,
        user,
        guild,
        reason: `AUTOMOD${action.reason ? ` || ${action.reason}` : ``}`,
        delMsgs: action.delMsgs,
        silent: action.delMsgs
      })
        .then(() =>
          action.action !== 4 ? msg.deletable && msg.delete() : true
        )
        .catch(() => false)
    );
  }
}
