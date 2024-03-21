import {
  getCarTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import Pedal from "./input/pedal";
import SteeringWheel from "./input/steering-wheel";

const InputTelemetry = () => {
  const telemetryProvider = useSelector(selectTelemetryProvider);
  const car = useSelector(getCarTelemetry);

  return (
    <>
      {telemetryProvider?.isOnTrack && car ? (
        <div className="content-center grid grid-cols-4 gap-4 p-2">
          <div>
            <span className="uppercase text-slate-500">Throttle</span>
            <Pedal value={car.throttle} />
          </div>
          <div>
            <span className="uppercase text-slate-500">Brake</span>
            <Pedal value={car.brake} />
          </div>
          <div>
            <span className="uppercase text-slate-500">Clutch</span>
            <Pedal value={car.clutch} />
          </div>
          <div>
            <span className="uppercase text-slate-500">Steering</span>
            <SteeringWheel angle={car.steeringAngle} />
          </div>
        </div>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default InputTelemetry;
