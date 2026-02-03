import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

/**
 * Tabs should own ONLY the bottom tab bar.
 * Each tab gets its own Stack (_layout.tsx) so the header is consistent everywhere.
 */
export default function TabLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Tabs
      initialRouteName="overview"
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: isDark ? "rgb(248 113 113)" : "rgb(239 68 68)",
        tabBarInactiveTintColor: isDark ? "rgb(107 114 128)" : "rgb(156 163 175)",
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
