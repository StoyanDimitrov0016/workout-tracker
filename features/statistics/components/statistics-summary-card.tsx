import { MetricCard } from "@/components/ui/metric-card";

type StatisticsSummaryCardProps = {
  label: string;
  value: string;
};

export function StatisticsSummaryCard({ label, value }: StatisticsSummaryCardProps) {
  return <MetricCard label={label} value={value} className="min-w-40" />;
}
