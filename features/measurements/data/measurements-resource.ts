import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const measurementsResource = {
  circumferences: {
    useCreate() {
      return useMutation(api.circumferences.create);
    },

    useRecent(limit: number) {
      return useQuery(api.circumferences.listRecent, { limit });
    },
  },

  weight: {
    useCreate() {
      return useMutation(api.weights.create);
    },

    useLatestAndAverage(days: number) {
      return useQuery(api.weights.getLatestAndAverage, { days });
    },

    useRecent(limit: number) {
      return useQuery(api.weights.listRecent, { limit });
    },

    useRemove() {
      return useMutation(api.weights.remove);
    },

    useTrend(limit: number) {
      return useQuery(api.weights.getTrend, { limit });
    },
  },
};
