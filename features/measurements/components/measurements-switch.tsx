import { useRouter, useSegments } from "expo-router";
import { Pressable, Text, View } from "react-native";

const tabs = [
  {
    key: "weight",
    label: "Weight",
    href: "/(tabs)/measurements/weight",
  },
  {
    key: "circumferences",
    label: "Circumferences",
    href: "/(tabs)/measurements/circumferences",
  },
] as const;

function getActiveKey(segments: string[]) {
  const measurementsIndex = segments.indexOf("measurements");
  if (measurementsIndex === -1) return "weight";
  const nextSegment = segments[measurementsIndex + 1];
  if (nextSegment === "circumferences") return "circumferences";
  return "weight";
}

export function MeasurementsSwitch() {
  const segments = useSegments();
  const router = useRouter();
  const activeKey = getActiveKey(segments);

  return (
    <View className="flex-row rounded-2xl border border-border bg-card p-1">
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => router.replace(tab.href)}
            className={`flex-1 rounded-xl px-3 py-2 ${isActive ? "bg-primary" : "bg-transparent"}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                isActive ? "text-white" : "text-text-secondary"
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
