import { type ColorSchemeName } from "react-native";

export type AppColorScheme = "light" | "dark";

export function normalizeColorScheme(colorScheme: ColorSchemeName): AppColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}
