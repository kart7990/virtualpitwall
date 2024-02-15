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
        <div className="grid grid-rows-4 grid-flow-col gap-4 p-2">
          <DataDisplay title="Speed" content={car.getSpeed()} />
          <DataDisplay title="Throttle" content={car.throttle + "%"} />
          <DataDisplay title="Brake" content={car.brake + "%"} />
          <DataDisplay title="Clutch" content={car.clutch + "%"} />
          <DataDisplay title="RPMs" content={car.getRpm()} />
          <DataDisplay
            title="Steering Angle"
            content={car.getSteeringAngle()}
          />
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
