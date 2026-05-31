import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { getNavigationColors } from "@/constants/navigation";

/**
 * Tabs should own ONLY the bottom tab bar.
 * Each tab gets its own Stack (_layout.tsx) so the header is consistent everywhere.
 */
export default function TabLayout() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const { backgroundColor, borderColor, tabActiveTintColor, tabInactiveTintColor } =
    getNavigationColors(isDark);

  return (
    <Tabs
      initialRouteName="overview"
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor },
        tabBarActiveTintColor: tabActiveTintColor,
        tabBarInactiveTintColor: tabInactiveTintColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="measurements"
        options={{
          title: "Measurements",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "body" : "body-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="start-session"
        options={{
          title: "Start session",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "barbell" : "barbell-outline"}
              size={size + 4}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          popToTopOnBlur: true,
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              onPress={(event) => {
                if (props.accessibilityState?.selected) {
                  router.dismissTo("/statistics");
                  return;
                }

                props.onPress?.(event);
              }}
            />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="training-split"
        options={{
          title: "Training split",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
