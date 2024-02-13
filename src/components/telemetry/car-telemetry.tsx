import {
  selectMeasurementSystem,
  selectTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";

const Telemetry = () => {
  const measurement = useSelector(selectMeasurementSystem);
  const telemetryProvider = useSelector(selectTelemetryProvider);
  const telemetry = useSelector(selectTelemetry);
  const car = telemetry?.car;

  return (
    <>
      {telemetryProvider?.isOnTrack && car ? (
        <div className="flex flex-wrap gap-4 p-3">
          <DataDisplay title="Speed" content={car.getSpeed(measurement)} />
          <DataDisplay title="RPMs" content={car.getRpm()} />
          <DataDisplay
            title="Fuel Quantity"
            content={car.getFuelQuantity(measurement)}
          />
          <DataDisplay title="Fuel %" content={car.getFuelPercent()} />
          <DataDisplay title="Throttle" content={car.throttle + "%"} />
          <DataDisplay title="Brake" content={car.brake + "%"} />
          <DataDisplay title="Clutch" content={car.clutch + "%"} />
          <DataDisplay
            title="Steering Angle"
            content={car.getSteeringAngle()}
          />
          <DataDisplay title="Fuel Pressure" content={car.getFuelPressure()} />
          <DataDisplay title="Oil Temp" content={car.getOilTemp(measurement)} />
          <DataDisplay title="Oil Pressure" content={car.getOilPressure()} />
          <DataDisplay
            title="Water Temp"
            content={car.getWaterTemp(measurement)}
          />
        </div>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default Telemetry;
