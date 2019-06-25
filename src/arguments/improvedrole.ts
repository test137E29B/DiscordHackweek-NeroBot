import { Argument, Possible, KlasaMessage, constants } from "klasa";
const {
  MENTION_REGEX: { role }
} = constants;

export default class extends Argument {
  run(arg: string, possible: Possible, msg: KlasaMessage) {
    if (msg.args[0] !== "set") return;

    try {
      if (role.test(arg))
        return this.client.arguments.get("role").run(arg, possible, msg);

      const possibleRole = msg.guild.roles.find(role => role.name === arg);
      if (possibleRole) return possibleRole;
    } catch (e) {
      throw msg.language.get("RESOLVER_IMPROVEDROLE_INVALID");
    }
    throw msg.language.get("RESOLVER_IMPROVEDROLE_INVALID");
  }
}
