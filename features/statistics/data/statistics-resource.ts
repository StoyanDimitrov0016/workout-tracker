import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const statisticsResource = {
  useHistory(limit = 50) {
    return useQuery(api.workoutSessions.listCompleted, { limit });
  },

  useOverview() {
    return useQuery(api.workoutSessions.getStatisticsOverview);
  },

  useSessionDetail(sessionId: Id<"workoutSessions"> | null) {
    return useQuery(
      api.workoutSessions.getCompletedById,
      sessionId !== null ? { sessionId } : "skip"
    );
  },
};
