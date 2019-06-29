import { KlasaClient, SchemaFolder } from "klasa";
import { TextChannel, Role } from "discord.js";
import { Schema } from "klasa";
const { defaultGuildSchema } = KlasaClient;

enum NeroModActionType {
  BAN,
  SOFTBAN,
  TEMPBAN,
  KICK,
  DELETE,
  WARN
}

interface NeroModAction {
  action: NeroModActionType;
  args: string[];
  reason?: string;
}

interface PerspectiveToxicity {
  threshold: number;
  action: NeroModAction;
  reason?: string;
  days?: string;
}

export interface NeroGuildSchema extends Schema {
  automod: {
    enabled: boolean;
    perspective: {
      enabled: boolean;
      channels: TextChannel[];
      toxicity: PerspectiveToxicity[];
    };
    words: {
      enabled: boolean;
      channels: TextChannel[];
      list: string[];
      action: NeroModAction;
    };
    invite: {
      enabled: boolean;
      channels: TextChannel[];
      action: NeroModAction;
    };
    repetition: {
      enabled: boolean;
      channels: TextChannel[];
      action: NeroModAction;
    };
  };
  warns: {
    enabled: boolean;
    actions: NeroModAction[];
  };
  toUnmute: string[];
  roles: {
    staff: {
      mute: Role;
      warn: Role;
      kick: Role;
      ban: Role;
      manager: Role;
      admin: Role;
    };
    punishments: {
      muted: Role;
    };
  };
}
export interface NeroGuildSettingsOnly {
  automod: {
    enabled: boolean;
    perspective: {
      enabled: boolean;
      channels: TextChannel[];
      toxicity: PerspectiveToxicity[];
    };
    words: {
      enabled: boolean;
      channels: TextChannel[];
      list: string[];
      action: NeroModAction;
    };
    invite: {
      enabled: boolean;
      channels: TextChannel[];
      action: NeroModAction;
    };
    repetition: {
      enabled: boolean;
      channels: TextChannel[];
      action: NeroModAction;
    };
  };
  warns: {
    enabled: boolean;
    actions: NeroModAction[];
  };
  toUnmute: string[];
  roles: {
    staff: {
      mute: Role;
      warn: Role;
      kick: Role;
      ban: Role;
      manager: Role;
      admin: Role;
    };
    punishments: {
      muted: Role;
    };
  };
}

export const schema = defaultGuildSchema
  .add(
    "automod",
    (folder): SchemaFolder =>
      folder
        .add("enabled", "boolean", { default: false })

        .add(
          "perspective",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("toxicity", "any", { array: true })
        )

        .add(
          "words",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("list", "string", { array: true })
              .add("action", "any", {
                default: { action: "kick", reason: "Saying a blacklisted word" }
              })
        )

        .add(
          "invite",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("action", "any", {
                default: { action: "kick", reason: "Sending invites" }
              })
        )

        .add(
          "repetition",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("action", "any", {
                default: { action: "kick", reason: "Don't repeat messages!" }
              })
        )
  )

  .add(
    "roles",
    (folder): SchemaFolder =>
      folder
        .add(
          "staff",
          (subfolder): SchemaFolder =>
            subfolder
              .add("mute", "role")
              .add("warn", "role")
              .add("kick", "role")
              .add("ban", "role")
              .add("manager", "role")
              .add("admin", "role")
        )
        .add(
          "punishments",
          (subfolder): SchemaFolder => subfolder.add("muted", "role")
        )
  );
