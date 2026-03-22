import { useColorScheme as useNativeColorScheme } from "react-native";

import { normalizeColorScheme, type AppColorScheme } from "@/hooks/color-scheme";

export function useColorScheme(): AppColorScheme {
  return normalizeColorScheme(useNativeColorScheme());
}
