import { PermissionLevels, KlasaMessage } from 'klasa';
import { Role } from 'discord.js';

export default new PermissionLevels()
  // Everyone
  .add(0, () => true)

  // Warn Permission
  .add(2, ({ guild, member }: KlasaMessage) => {
    if (!guild) return false

    // @ts-ignore
    return (member.roles.some((role: Role) => role.id === guild.settings.roles.warn))
  }, {
   fetch: true
  })

  // Kick Permission
  .add(3, ({ guild, member }: KlasaMessage) => {
    if (!guild) return false

    // @ts-ignore
    return (member.roles.some((role: Role) => role.id === guild.settings.roles.kick) || member.permissions.has('KICK_MEMBERS'))
  }, {
    fetch: true
  })

  // Ban Permission
  .add(4, ({ guild, member }: KlasaMessage) => {
    if (!guild) return false

    // @ts-ignore
    return (member.roles.some((role: Role) => role.id === guild.settings.roles.ban) || member.permissions.has('BAN_MEMBERS'))
  }, {
    fetch: true
  })

  // Manage Guild
  .add(5, ({ guild, member }: KlasaMessage) => {
    if (!guild) return false

    // @ts-ignore
    return (member.roles.some((role: Role) => role.id === guild.settings.roles.manager) || member.permissions.has('MANAGE_GUILD'))
  }, {
    fetch: true
  })

  // Administrator
  .add(6, ({ guild, member }: KlasaMessage) => {
    if (!guild) return false

    // @ts-ignore
    return (member.roles.some((role: Role) => role.id === guild.settings.roles.admin) || member.permissions.has('ADMINISTRATOR'))
  }, {
    fetch: true
  })

  // Guild Owner
  .add(7, ({ guild, author }: KlasaMessage) => {
    if (!guild) return false

    return (author.id === guild.ownerID)
  }, {
    fetch: true
  })

  // Bot Owner
  .add(9, ({ author, client }: KlasaMessage) => {
    // @ts-ignore
    return client.owners.some((id: String) => author.id === id)
  }, {
    break: true
  })

  // Bot Owner (Silent)
  .add(10, ({ author, client }: KlasaMessage) => {
    // @ts-ignore
    return client.owners.some((id: String) => author.id === id)
  })