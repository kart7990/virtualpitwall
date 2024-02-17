import {
  selectTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";

const Telemetry = () => {
  const telemetryProvider = useSelector(selectTelemetryProvider);
  const telemetry = useSelector(selectTelemetry);
  const car = telemetry?.car;

  return (
    <>
      {telemetryProvider?.isOnTrack && car ? (
        <div className="grid grid-cols-3 gap-4 p-2">
          <DataDisplay title="Speed" content={car.getSpeed()} />
          <DataDisplay title="RPMs" content={car.getRpm()} />
          <DataDisplay title="Oil Temp" content={car.getOilTemp()} />
          <DataDisplay title="Oil Pressure" content={car.getOilPressure()} />
          <DataDisplay title="Water Temp" content={car.getWaterTemp()} />
        </div>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default Telemetry;
