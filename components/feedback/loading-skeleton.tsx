import { ReactNode, useEffect } from "react";
import { StyleProp, View, ViewStyle, useColorScheme } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonBlockProps = {
  height?: number;
  style?: StyleProp<ViewStyle>;
  width?: number | `${number}%`;
};

type SkeletonCardProps = {
  children: ReactNode;
  className?: string;
};

function SkeletonCard({ children, className = "" }: SkeletonCardProps) {
  return <View className={`gap-3 rounded-2xl border border-border bg-card p-4 ${className}`}>{children}</View>;
}

function SkeletonStatRow() {
  return (
    <View className="flex-row items-center justify-between">
      <SkeletonBlock width="32%" />
      <SkeletonBlock width="18%" />
    </View>
  );
}

function SkeletonMetricGrid() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} className="min-w-36 flex-1 gap-3 rounded-2xl border border-border bg-card p-4">
          <SkeletonBlock width="44%" />
          <SkeletonBlock height={28} width="72%" />
        </View>
      ))}
    </View>
  );
}

function SkeletonWorkoutCard() {
  return (
    <SkeletonCard>
      <View className="gap-2">
        <SkeletonBlock width="38%" />
        <SkeletonBlock height={18} width="62%" />
        <SkeletonBlock width="48%" />
      </View>
      <View className="flex-row flex-wrap gap-2">
        <SkeletonBlock height={28} width={74} style={{ borderRadius: 999 }} />
        <SkeletonBlock height={28} width={82} style={{ borderRadius: 999 }} />
        <SkeletonBlock height={28} width={88} style={{ borderRadius: 999 }} />
      </View>
    </SkeletonCard>
  );
}

export function SkeletonBlock({
  height = 12,
  style,
  width = "100%",
}: SkeletonBlockProps) {
  const isDark = useColorScheme() === "dark";
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: isDark ? "rgba(75, 85, 99, 0.92)" : "rgba(229, 231, 235, 0.96)",
          borderRadius: 12,
          height,
          width,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function AppShellSkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock width="22%" />
        <SkeletonBlock height={30} width="44%" />
        <SkeletonBlock width="58%" />
      </View>

      <SkeletonCard>
        <SkeletonBlock width="32%" />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
      </SkeletonCard>

      <View className="gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonWorkoutCard key={index} />
        ))}
      </View>
    </View>
  );
}

export function OverviewScreenSkeleton() {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <SkeletonBlock width="28%" />
        <SkeletonBlock height={30} width="52%" />
      </View>

      <View className="flex-row gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} className="w-64">
            <SkeletonWorkoutCard />
          </View>
        ))}
      </View>

      <SkeletonCard>
        <SkeletonBlock width="34%" />
        <SkeletonBlock height={20} width="56%" />
        <SkeletonBlock width="44%" />
        <SkeletonBlock height={44} width="48%" />
      </SkeletonCard>

      <SkeletonCard>
        <SkeletonBlock width="30%" />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
      </SkeletonCard>

      <View className="gap-2">
        <SkeletonBlock width="24%" />
        <SkeletonMetricGrid />
      </View>
    </View>
  );
}

export function StatisticsScreenSkeleton() {
  return (
    <View className="gap-6">
      <SkeletonMetricGrid />

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <SkeletonBlock width="30%" />
          <SkeletonBlock width="16%" />
        </View>
        <View className="gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonWorkoutCard key={index} />
          ))}
        </View>
      </View>

      <View className="gap-3">
        <SkeletonBlock width="36%" />
        <View className="gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <SkeletonBlock height={18} width="40%" />
              <SkeletonBlock width="28%" />
              <View className="flex-row flex-wrap gap-2">
                <SkeletonBlock height={28} width={74} style={{ borderRadius: 999 }} />
                <SkeletonBlock height={28} width={82} style={{ borderRadius: 999 }} />
                <SkeletonBlock height={28} width={92} style={{ borderRadius: 999 }} />
              </View>
            </SkeletonCard>
          ))}
        </View>
      </View>
    </View>
  );
}

export function MeasurementsWeightScreenSkeleton() {
  return (
    <View className="gap-5 pb-4 pt-1">
      <SkeletonBlock height={50} width="100%" />

      <SkeletonCard>
        <SkeletonBlock height={22} width="34%" />
        <SkeletonBlock height={48} width="100%" />
        <View className="flex-row gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} height={34} width="18%" style={{ minWidth: 48 }} />
          ))}
        </View>
        <SkeletonBlock height={48} width="100%" />
      </SkeletonCard>

      <SkeletonCard>
        <View className="flex-row items-center justify-between">
          <SkeletonBlock height={22} width="34%" />
          <SkeletonBlock height={34} width={92} />
        </View>
        <SkeletonBlock width="70%" />
        <View className="gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonStatRow key={index} />
          ))}
        </View>
      </SkeletonCard>

      <SkeletonCard>
        <SkeletonBlock height={22} width="28%" />
        <View className="flex-row flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} className="min-w-28 flex-1 gap-3 rounded-xl bg-surface p-3">
              <SkeletonBlock width="56%" />
              <SkeletonBlock height={18} width="72%" />
            </View>
          ))}
        </View>
        <View className="flex-row items-end gap-2 rounded-2xl bg-surface px-3 pb-3 pt-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} className="flex-1">
              <SkeletonBlock height={36 + (index % 4) * 14} style={{ alignSelf: "flex-end" }} />
            </View>
          ))}
        </View>
      </SkeletonCard>
    </View>
  );
}

export function MeasurementsCircumferencesScreenSkeleton() {
  return (
    <View className="gap-5 pb-4 pt-1">
      <SkeletonBlock height={50} width="100%" />

      <SkeletonCard>
        <SkeletonBlock height={22} width="42%" />
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} className="flex-row gap-3">
            <View className="flex-1">
              <SkeletonBlock height={48} />
            </View>
            <View className="flex-1">
              <SkeletonBlock height={48} />
            </View>
          </View>
        ))}
        <SkeletonBlock height={48} width="100%" />
      </SkeletonCard>

      <View className="gap-3">
        <SkeletonBlock height={22} width="34%" />
        <View className="w-full">
          <SkeletonCard>
            <SkeletonBlock width="36%" />
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonStatRow key={index} />
            ))}
          </SkeletonCard>
        </View>
      </View>
    </View>
  );
}

export function StartSessionScreenSkeleton() {
  return (
    <View className="gap-6">
      <View className="flex-row gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} className="w-44">
            <SkeletonWorkoutCard />
          </View>
        ))}
      </View>

      <SkeletonCard>
        <SkeletonBlock width="24%" />
        <SkeletonBlock width="72%" />
        <View className="gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} className="gap-2">
              <SkeletonBlock height={18} width="42%" />
              <SkeletonBlock width="56%" />
            </View>
          ))}
        </View>
      </SkeletonCard>

      <SkeletonBlock height={48} width="100%" />
    </View>
  );
}

export function TrainingSplitScreenSkeleton() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between gap-3">
        <SkeletonBlock height={30} width="42%" />
        <SkeletonBlock width="14%" />
      </View>

      <View className="gap-3">
        <SkeletonBlock width="20%" />
        <View className="gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index}>
              <View className="flex-row items-center justify-between">
                <SkeletonBlock width="18%" />
                <SkeletonBlock height={28} width={68} style={{ borderRadius: 999 }} />
              </View>
              <SkeletonBlock height={18} width="40%" />
              <SkeletonBlock width="68%" />
            </SkeletonCard>
          ))}
        </View>
      </View>
    </View>
  );
}

export function SplitBuilderSkeleton() {
  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <SkeletonBlock width="26%" />
        <SkeletonBlock height={30} width="48%" />
      </View>

      <SkeletonCard className="flex-1">
        <SkeletonBlock height={48} width="100%" />
        <View className="gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="bg-surface">
              <View className="flex-row items-center justify-between">
                <SkeletonBlock width="24%" />
                <SkeletonBlock height={28} width={72} style={{ borderRadius: 999 }} />
              </View>
              <SkeletonBlock height={44} width="100%" />
              <SkeletonBlock width="52%" />
            </SkeletonCard>
          ))}
        </View>
      </SkeletonCard>

      <View className="gap-3 border-t border-border bg-background pt-4">
        <SkeletonBlock height={48} width="100%" />
        <SkeletonBlock width="44%" style={{ alignSelf: "center" }} />
      </View>
    </View>
  );
}

export function TrainingSplitDaySkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock width="22%" />
        <SkeletonBlock height={30} width="46%" />
      </View>

      <SkeletonCard>
        <SkeletonBlock width="34%" />
        <SkeletonBlock width="72%" />
        <View className="gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} className="gap-2 rounded-xl bg-surface p-3">
              <SkeletonBlock height={18} width="42%" />
              <SkeletonBlock width="56%" />
              <SkeletonBlock width="38%" />
            </View>
          ))}
        </View>
      </SkeletonCard>
    </View>
  );
}

export function StatisticsHistoryScreenSkeleton() {
  return (
    <View className="gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonWorkoutCard key={index} />
      ))}
      <SkeletonBlock height={48} width="100%" />
    </View>
  );
}

export function WorkoutSessionDetailSkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock width="26%" />
        <SkeletonBlock height={30} width="50%" />
        <SkeletonBlock width="44%" />
      </View>

      <SkeletonCard>
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
      </SkeletonCard>

      <View className="gap-3">
        <SkeletonBlock height={20} width="24%" />
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonCard key={index}>
            <SkeletonBlock height={18} width="42%" />
            <SkeletonBlock width="60%" />
            <View className="flex-row flex-wrap gap-2">
              <SkeletonBlock height={28} width={74} style={{ borderRadius: 999 }} />
              <SkeletonBlock height={28} width={82} style={{ borderRadius: 999 }} />
              <SkeletonBlock height={28} width={88} style={{ borderRadius: 999 }} />
            </View>
            {Array.from({ length: 2 }).map((__, setIndex) => (
              <View key={setIndex} className="gap-2 rounded-xl bg-surface p-3">
                <SkeletonBlock width="18%" />
                <SkeletonStatRow />
                <SkeletonStatRow />
                <SkeletonStatRow />
              </View>
            ))}
          </SkeletonCard>
        ))}
      </View>
    </View>
  );
}

export function WorkoutSummarySkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock width="26%" />
        <SkeletonBlock height={30} width="52%" />
        <SkeletonBlock width="44%" />
      </View>

      <SkeletonCard>
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
        <SkeletonStatRow />
      </SkeletonCard>

      <View className="gap-3">
        <SkeletonBlock height={48} width="100%" />
        <SkeletonBlock height={48} width="100%" />
        <SkeletonBlock height={48} width="100%" />
      </View>
    </View>
  );
}
