import { Function } from "@kcp/functions";
import { User, Guild, Message } from "discord.js";

export default class extends Function {
  async run({
    msg,
    guild,
    mod,
    reason,
    silent
  }: {
    msg: Message;
    guild: Guild;
    mod?: User;
    reason?: string;
    silent: boolean;
  }) {
    return msg
      .delete({
        reason: `${mod ? `${mod.tag} - ` : ``}UNBAN${
          reason ? ` || ${reason}` : ``
        }`
      })
      .then(user =>
        this.client.emit("modlog", {
          msg,
          guild,
          mod,
          reason,
          silent,
          type: "DELETE"
        })
      );
  }
}
