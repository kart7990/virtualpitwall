import {
  selectCurrentCar,
  selectTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";
import { N_A } from "../utils/constants";

const Timing = () => {
  const telemetryProvider = useSelector(selectTelemetryProvider);
  const telemetry = useSelector(selectTelemetry);
  const time = telemetry?.timing;
  const currentCar = useSelector(selectCurrentCar);

  return (
    <>
      {telemetryProvider?.isOnTrack &&
      telemetry?.car !== null &&
      currentCar &&
      time ? (
        <>
          <div className="flex flex-wrap gap-4 p-3">
            <DataDisplay title="Current Lap" content={time.getCurrentLap()} />
            <DataDisplay
              title="Delta Best Lap"
              contentClassNames={
                // display green for negative delta and red for positive
                time.isDeltaNegative()
                  ? "text-green-600"
                  : time.isDeltaPositive()
                    ? "text-red-700"
                    : ""
              }
              content={time.getCarDelta()}
            />
            <DataDisplay
              title="Best Lap"
              content={currentCar.getBestLapTime()}
            />
            <DataDisplay
              title="Last Lap"
              content={currentCar.getLastLapTime()}
            />
            <DataDisplay title="Avg Lap" content={N_A} />
            <DataDisplay title="Incidents" content={time.getIncidents()} />
          </div>
        </>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default Timing;
