import { useState } from "react";
import { View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import {
  MeasurementsSwitch,
  type MeasurementView,
} from "@/features/measurements/components/measurements-switch";
import { MeasurementsCircumferencesScreen } from "@/features/measurements/screens/measurements-circumferences-screen";
import { MeasurementsWeightScreen } from "@/features/measurements/screens/measurements-weight-screen";

type MeasurementsScreenProps = {
  initialView?: MeasurementView;
};

export function MeasurementsScreen({ initialView = "weight" }: MeasurementsScreenProps) {
  const [activeView, setActiveView] = useState<MeasurementView>(initialView);

  return (
    <ScreenWrapper>
      <View className="gap-5 pb-4 pt-1">
        <MeasurementsSwitch activeView={activeView} onViewChange={setActiveView} />
        {activeView === "weight" ? (
          <MeasurementsWeightScreen />
        ) : (
          <MeasurementsCircumferencesScreen />
        )}
      </View>
    </ScreenWrapper>
  );
}
