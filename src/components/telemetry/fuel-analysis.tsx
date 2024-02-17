import {
  selectCurrentTrackSession,
  selectMeasurementSystem,
  selectTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";
import { N_A } from "../utils/constants";
import { formatFuel } from "../utils/formatter/Fuel";
import { convertMsToDisplay } from "../utils/formatter/Time";

const FuelAnalysis = () => {
  const measurement = useSelector(selectMeasurementSystem);
  const telemetryProvider = useSelector(selectTelemetryProvider);
  const telemetry = useSelector(selectTelemetry);
  const car = telemetry?.car;
  const laps = telemetry?.laps;

  const session = useSelector(selectCurrentTrackSession);

  const completedLaps = session?.completedLaps?.laps.filter(
    (l) => l.carNumber === telemetryProvider?.carNumber,
  );

  const lastLapConsumed =
    laps && laps.length > 0
      ? formatFuel(laps[laps.length - 1].fuelConsumed, measurement)
      : N_A;

  const validLaps = laps
    ? laps.filter(
        (lap) => lap.greenFlagFullLap && lap.lapNumber > 1 && !lap.inPitLane,
      )
    : [];
  const validLapsTotalConsumed =
    validLaps.length > 0
      ? validLaps.reduce(
          (totalConsumed, lap) => totalConsumed + lap.fuelConsumed,
          0,
        )
      : N_A;
  const averageConsumed =
    validLaps && validLapsTotalConsumed !== N_A
      ? formatFuel(validLapsTotalConsumed / validLaps.length, measurement)
      : N_A;
  const maxConsumption = validLaps
    ? formatFuel(
        Math.max.apply(
          Math,
          validLaps.map((lap) => lap.fuelConsumed),
        ),
        measurement,
      )
    : N_A;
  const minConsumption = validLaps
    ? formatFuel(
        Math.min.apply(
          Math,
          validLaps.map((lap) => lap.fuelConsumed),
        ),
        measurement,
      )
    : N_A;

  const getLapTime = (lapNumber: number) => {
    const lap = completedLaps?.find((l) => l.lapNumber === lapNumber);
    return lap ? convertMsToDisplay(lap?.lapTime) : N_A;
  };

  return (
    <>
      {telemetryProvider?.isOnTrack && car ? (
        <div className="flex flex-row">
          <div className="grid grid-rows-4 grid-flow-col gap-4 p-2">
            <DataDisplay title="Fuel Level" content={car.getFuelQuantity()} />
            <DataDisplay title="Fuel %" content={car.getFuelPercent()} />
            <DataDisplay
              title="Current Lap"
              content={car.getFuelConsumedLap()}
            />
            <DataDisplay title="Last Lap Usage" content={lastLapConsumed} />
            <DataDisplay title="Average Usage" content={averageConsumed} />
            <DataDisplay title="Max Usage" content={maxConsumption} />
            <DataDisplay title="Min Usage" content={minConsumption} />
          </div>
          <div>
            <table className="border-collapse border-slate-500">
              <thead>
                <tr className="border-b-2">
                  <th className="p-1">Lap Number</th>
                  <th className="p-1">Lap Time</th>
                  <th className="p-1">Fuel Consumed</th>
                </tr>
              </thead>
              <tbody>
                {laps
                  .slice(-5)
                  .sort((a, b) => b.lapNumber - a.lapNumber)
                  .map((lap, index) => (
                    <tr className="border-b-2" key={index}>
                      <td className="p-1">{lap.lapNumber}</td>
                      <td className="p-1">{getLapTime(lap.lapNumber)}</td>
                      <td className="p-1 text-right">
                        {lap.getFuelConsumed()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default FuelAnalysis;
