import { MetricCard } from "@/components/ui/metric-card";

type OverviewMetricCardProps = {
  label: string;
  value: string;
};

export function OverviewMetricCard({ label, value }: OverviewMetricCardProps) {
  return <MetricCard label={label} value={value} />;
}
