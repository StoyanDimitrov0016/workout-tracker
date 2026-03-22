import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";

export const ICON_SYMBOL_MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as const satisfies Record<string, ComponentProps<typeof MaterialIcons>["name"]>;

export type IconSymbolName = keyof typeof ICON_SYMBOL_MAPPING;
