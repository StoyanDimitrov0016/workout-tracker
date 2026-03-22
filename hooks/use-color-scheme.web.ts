import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import { normalizeColorScheme, type AppColorScheme } from "@/hooks/color-scheme";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): AppColorScheme {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = normalizeColorScheme(useRNColorScheme());

  if (hasHydrated) {
    return colorScheme;
  }

  return "light";
}
