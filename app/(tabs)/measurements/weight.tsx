import { MeasurementsScreen } from "@/features/measurements/screens/measurements-screen";

export { RouteErrorBoundary as ErrorBoundary } from "@/components/feedback/route-error-boundary";

export default function MeasurementsWeightRoute() {
  return <MeasurementsScreen initialView="weight" />;
}
