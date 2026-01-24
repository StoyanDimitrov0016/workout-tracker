import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: isDark ? "rgb(248 113 113)" : "rgb(239 68 68)", // primary
        tabBarInactiveTintColor: isDark ? "rgb(107 114 128)" : "rgb(156 163 175)", // text-tertiary
        tabBarStyle: {
          backgroundColor: isDark ? "rgb(17 24 39)" : "rgb(255 255 255)",
          borderTopColor: isDark ? "rgb(55 65 81)" : "rgb(229 231 235)",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={size} color={color} />
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
          title: "Workout",
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
          title: "Stats",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "analytics" : "analytics-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="training-split"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
