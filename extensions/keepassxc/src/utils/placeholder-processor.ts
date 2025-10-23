import { getTOTPCode } from "./totp";

/**
 * Interface representing a KeePass entry with all its fields
 */
export interface KeePassEntry {
  group: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  totp: string;
}

/**
 * Converts a string array from KeePassXC CLI to a KeePassEntry object
 * @param entry - The string array from KeePassXC CLI export
 * @returns KeePassEntry object
 */
export function arrayToEntry(entry: string[]): KeePassEntry {
  return {
    group: entry[0] || "",
    title: entry[1] || "",
    username: entry[2] || "",
    password: entry[3] || "",
    url: entry[4] || "",
    notes: entry[5] || "",
    totp: entry[6] || "",
  };
}

/**
 * Processes placeholders in a string according to KeePassXC placeholder syntax
 * @param text - The text containing placeholders
 * @param entry - The KeePass entry data for placeholder resolution
 * @returns The processed text with placeholders replaced
 */
export function processPlaceholders(text: string, entry: KeePassEntry): string {
  if (!text) return text;

  let processed = text;

  processed = processed.replace(/{TITLE}/g, entry.title);
  processed = processed.replace(/{USERNAME}/g, entry.username);
  processed = processed.replace(/{PASSWORD}/g, entry.password);
  processed = processed.replace(/{URL}/g, entry.url);
  processed = processed.replace(/{NOTES}/g, entry.notes);

  // TOTP placeholder - only process if TOTP is available
  if (entry.totp) {
    try {
      const totpCode = getTOTPCode(entry.totp);
      processed = processed.replace(/{TOTP}/g, totpCode);
    } catch {
      // If TOTP generation fails, leave {TOTP} as is
    }
  }

  return processed;
}
