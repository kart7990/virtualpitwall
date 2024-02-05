import { selectCurrentCar, selectTelemetry, useSelector } from "@/lib/redux";
import {
  LiveTimeClass,
  TimingTelemetryClass,
} from "@/lib/redux/slices/pitwallSlice/models";
import { DataDisplay } from "../core/ui/data-display";

const Timing = () => {
  const telemetry = useSelector(selectTelemetry);
  const time = new TimingTelemetryClass(telemetry?.timing);
  const currentCar = new LiveTimeClass(useSelector(selectCurrentCar));

  return (
    <>
      {telemetry?.car !== null ? (
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
            <DataDisplay title="Avg Lap" content="n/a" />
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
