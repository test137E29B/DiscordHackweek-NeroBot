import { KlasaClient, SchemaFolder, Schema } from "klasa";
import { TextChannel, Role } from "discord.js";
const { defaultGuildSchema } = KlasaClient;

enum NeroModDashboardActionType {
  BAN,
  SOFTBAN,
  TEMPBAN,
  KICK,
  DELETE,
  WARN,
  MUTE
}

export enum NeroModActionType {
  BAN,
  SOFTBAN,
  TEMPBAN,
  KICK,
  DELETE,
  WARN,
  MUTE,
  PRUNE,
  PRUNECHANNEL
}

export interface NeroModAction {
  action: NeroModDashboardActionType;
  duration?: Date;
  ignoreStaff: boolean;
  reason?: string;
  feedback?: {
    enabled: boolean;
    text: string;
  };
  delMsgs?: 7 | 1 | 0;
  silent: boolean;
}

export interface NeroThresholdModAction extends NeroModAction {
  threshold: number;
}

export interface NeroGuildSchema extends Schema {
  automod: {
    enabled: boolean;
    perspective: {
      enabled: boolean;
      channels: TextChannel[];
      toxicity: NeroThresholdModAction[];
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
    actions: NeroThresholdModAction[];
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
      toxicity: NeroThresholdModAction[];
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
    actions: NeroThresholdModAction[];
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

// @ts-ignore
export const schema: NeroGuildSchema = defaultGuildSchema
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
              .add("toxicity", "any", {
                array: true,
                configurable: false
              })
        )

        .add(
          "words",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("list", "string", { array: true })
              .add("action", "any", {
                default: {
                  action: "kick",
                  reason: "Saying a blacklisted word"
                },
                configurable: false
              })
        )

        .add(
          "invite",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("action", "any", {
                default: { action: "kick", reason: "Sending invites" },
                configurable: false
              })
        )

        .add(
          "repetition",
          (subfolder): SchemaFolder =>
            subfolder
              .add("enabled", "boolean", { default: false })
              .add("channels", "textchannel", { array: true })
              .add("action", "any", {
                default: { action: "kick", reason: "Don't repeat messages!" },
                configurable: false
              })
        )
  )

  .add(
    "warns",
    (folder): SchemaFolder =>
      folder
        .add("enabled", "boolean", { default: false })
        .add("actions", "any", {
          array: true,
          configurable: false
        })
  )
  .add("toUnmute", "user", {
    array: true,
    configurable: false
  })

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
