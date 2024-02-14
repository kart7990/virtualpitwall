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
        <div className="flex flex-wrap gap-4 p-2">
          <DataDisplay title="Speed" content={car.getSpeed()} />
          <DataDisplay title="RPMs" content={car.getRpm()} />
          <DataDisplay title="Fuel Quantity" content={car.getFuelQuantity()} />
          <DataDisplay title="Fuel %" content={car.getFuelPercent()} />
          <DataDisplay title="Throttle" content={car.throttle + "%"} />
          <DataDisplay title="Brake" content={car.brake + "%"} />
          <DataDisplay title="Clutch" content={car.clutch + "%"} />
          <DataDisplay
            title="Steering Angle"
            content={car.getSteeringAngle()}
          />
          <DataDisplay title="Fuel Pressure" content={car.getFuelPressure()} />
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
