export function getNavigationColors(isDark: boolean) {
  return {
    backgroundColor: isDark ? "rgb(17 24 39)" : "rgb(255 255 255)",
    borderColor: isDark ? "rgb(55 65 81)" : "rgb(229 231 235)",
    headerTintColor: isDark ? "rgb(243 244 246)" : "rgb(17 24 39)",
    tabActiveTintColor: isDark ? "rgb(248 113 113)" : "rgb(239 68 68)",
    tabInactiveTintColor: isDark ? "rgb(107 114 128)" : "rgb(156 163 175)",
  };
}
