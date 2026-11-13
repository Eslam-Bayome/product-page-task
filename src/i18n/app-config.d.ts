import type en from "../../messages/en.json";

// Type-checks every `useTranslations` key against the English messages.
declare module "use-intl" {
  interface AppConfig {
    Messages: typeof en;
  }
}
