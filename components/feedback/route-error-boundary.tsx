import { type ErrorBoundaryProps } from "expo-router";

import { Screen } from "@/components/ui/screen";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";

export function RouteErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const description = error.message.trim() || "Try again to reload this screen.";

  return (
    <Screen>
      <ScreenStateMessage
        title="Something went wrong."
        description={description}
        actionLabel="Try again"
        onAction={retry}
      />
    </Screen>
  );
}
