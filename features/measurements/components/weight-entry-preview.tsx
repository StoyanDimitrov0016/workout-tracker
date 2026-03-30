import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { Id } from "@/convex/_generated/dataModel";
import { WeightEntryItem } from "@/features/measurements/components/weight-entry-item";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";

type WeightEntryPreviewProps = {
  entries: Array<{
    _creationTime: number;
    _id: Id<"weights">;
    weightKg: number;
  }>;
};

export function WeightEntryPreview({ entries }: WeightEntryPreviewProps) {
  const removeLatest = measurementsResource.weight.useRemove();
  const [isRemoving, setIsRemoving] = useState(false);
  const latestEntryId = useMemo(() => entries[0]?._id ?? null, [entries]);
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
        {entries.length === 0 && (
          <Text className="text-text-tertiary">No entries yet. Log your first weight above.</Text>
        )}
        {entries.map((entry) => (
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
