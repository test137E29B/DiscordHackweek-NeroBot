import { Function } from "@kcp/functions";
import { User, Guild, Role } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    role,
    reason,
    silent
  }: {
    user: KlasaMember | string;
    guild: Guild;
    mod?: User;
    role?: Role | string;
    reason?: string;
    silent: boolean;
  }) {
    if (user instanceof KlasaMember && role)
      await user.edit(
        {
          roles: [
            ...user.roles
              .array()
              .filter(rol => rol.id !== (role instanceof Role ? role.id : role))
          ]
        },
        `${mod ? `${mod.tag} - ` : ``}UNMUTE${reason ? ` || ${reason}` : ``}`
      );

    // @ts-ignore
    await this.client.funcs.clearTasks({ user, guild, taskName: "unmute" });

    await guild.settings.update(
      "toUnmute",
      typeof user === "string" ? user : user.id,
      { action: "remove" }
    );

    // @ts-ignore
    const sett = await user.settings.sync(true);
    if (sett) await sett.update("muted", false);

    return this.client.emit("modlog", {
      user,
      guild,
      mod,
      reason,
      silent,
      type: "UNMUTE"
    });
  }
}
