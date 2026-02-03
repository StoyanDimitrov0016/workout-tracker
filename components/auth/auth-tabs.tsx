import { type Href, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type AuthTab = "sign-in" | "sign-up";

const tabs: { key: AuthTab; label: string; href: Href }[] = [
  { key: "sign-in", label: "Sign in", href: "/(auth)/sign-in" },
  { key: "sign-up", label: "Sign up", href: "/(auth)/sign-up" },
];

export function AuthTabs({ active }: { active: AuthTab }) {
  const router = useRouter();

  return (
    <View className="flex-row rounded-2xl border border-border bg-surface p-1">
      {tabs.map((tab) => {
        const isActive = active === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              if (!isActive) router.replace(tab.href);
            }}
            className={`flex-1 rounded-xl px-3 py-2 ${isActive ? "bg-card" : "bg-transparent"}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
