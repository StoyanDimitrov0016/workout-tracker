import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export function getRootTabScreenOptions(): NativeStackNavigationOptions {
  return {
    headerBackVisible: false,
    title: "",
    headerTitle: "",
  };
}
