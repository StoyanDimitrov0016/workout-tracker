import { usePaginatedQuery, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const WORKOUT_HISTORY_PAGE_SIZE = 20;

export const statisticsResource = {
  useHistory() {
    return usePaginatedQuery(api.workoutSessions.listCompletedPaginated, {}, {
      initialNumItems: WORKOUT_HISTORY_PAGE_SIZE,
    });
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
