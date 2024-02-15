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
        <div className="grid grid-cols-3 gap-4 p-2">
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
          <DataDisplay title="Incidents" content={time.getIncidents()} />
          <DataDisplay title="Last Lap" content={currentCar.getLastLapTime()} />
          <DataDisplay title="Best Lap" content={currentCar.getBestLapTime()} />
          <DataDisplay title="Avg Lap" content={N_A} />
        </div>
      ) : (
        <div className="p-2">Car is not on track</div>
      )}
    </>
  );
};

export default Timing;
