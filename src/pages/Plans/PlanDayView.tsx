import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Day routes redirect into PlanDetail focus mode with a day hash.
 */
export default function PlanDayView() {
  const { uuid, dayNumber } = useParams<{ uuid: string; dayNumber: string }>();

  useEffect(() => {
    if (dayNumber) {
      window.requestAnimationFrame(() => {
        window.location.hash = `day-${dayNumber}`;
      });
    }
  }, [dayNumber]);

  if (!uuid) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return <Navigate to={`/plans/${uuid}${dayNumber ? `#day-${dayNumber}` : ""}`} replace />;
}
