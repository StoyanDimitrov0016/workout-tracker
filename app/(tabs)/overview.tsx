import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Text } from "react-native";

export default function OverviewTab() {
  const tasks = useQuery(api.tasks.get);
  return (
    <ScreenWrapper>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id}>{text}</Text>
      ))}
    </ScreenWrapper>
  );
}
