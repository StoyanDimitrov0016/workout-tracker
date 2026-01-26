import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { WeightEntryItem } from "@/features/measurements/components/weight-entry-item";
import { WEIGHT_PREVIEW_LIMIT } from "@/features/measurements/constants/weight";

export function WeightEntryPreview() {
  const entries = useQuery(api.weights.listRecent, { limit: WEIGHT_PREVIEW_LIMIT });
  const removeLatest = useMutation(api.weights.remove);
  const [isRemoving, setIsRemoving] = useState(false);
  const latestEntryId = useMemo(() => entries?.[0]?._id ?? null, [entries]);
  const canUndo = Boolean(latestEntryId) && !isRemoving;

  const handleUndo = async () => {
    if (!latestEntryId) return;

    setIsRemoving(true);

    try {
      await removeLatest({ id: latestEntryId });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text-primary">Recent entries</Text>
        <Pressable
          onPress={handleUndo}
          disabled={!canUndo}
          className={`rounded-lg px-3 py-2 ${canUndo ? "bg-secondary" : "bg-border"}`}
        >
          <Text
            className={`text-sm font-semibold ${canUndo ? "text-white" : "text-text-secondary"}`}
          >
            {isRemoving ? "Undoing..." : "Undo last"}
          </Text>
        </Pressable>
      </View>
      <Text className="text-sm text-text-secondary">
        Undo removes your most recent entry if you made a typo.
      </Text>
      <View className="gap-2">
        {entries === undefined && <Text className="text-text-tertiary">Loading...</Text>}
        {entries?.length === 0 && (
          <Text className="text-text-tertiary">No entries yet. Log your first weight above.</Text>
        )}
        {entries?.map((entry) => (
          <WeightEntryItem
            key={entry._id}
            weightKg={entry.weightKg}
            createdAt={entry._creationTime}
          />
        ))}
      </View>
    </View>
  );
}
