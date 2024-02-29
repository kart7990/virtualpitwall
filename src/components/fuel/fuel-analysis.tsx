import {
  selectCurrentTrackSession,
  selectMeasurementSystem,
  selectTelemetry,
  selectTelemetryProvider,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";
import SimpleTable from "../core/ui/table";
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

  const getFuelTable = () => {
    const header = [
      "Lap Number",
      "Lap Time",
      "Fuel Consumed",
      "Laps Remaining",
    ];
    const data = laps
      .slice(-5)
      .sort((a, b) => b.lapNumber - a.lapNumber)
      .map((lap, index) => [
        lap.lapNumber,
        getLapTime(lap.lapNumber),
        lap.getFuelConsumed(),
        lap.getRemainingLaps(),
      ]);
    return <SimpleTable headers={header} data={data} />;
  };

  return (
    <>
      {telemetryProvider?.isOnTrack && car ? (
        <>
          <div className="grid grid-cols-4 gap-4 p-2">
            <DataDisplay title="Fuel Level" content={car.getFuelQuantity()} />
            <DataDisplay title="Fuel %" content={car.getFuelPercent()} />
            <DataDisplay
              title="Current Lap Usage"
              content={car.getFuelConsumedLap()}
            />
            <DataDisplay title="Last Lap Usage" content={lastLapConsumed} />
            <DataDisplay title="Avg. Usage" content={averageConsumed} />
            <DataDisplay title="Max Usage" content={maxConsumption} />
            <DataDisplay title="Min Usage" content={minConsumption} />
          </div>
          <div className="gap-4 p-2">{getFuelTable()}</div>
        </>
      ) : (
        <div className="p-3">Car is not on track</div>
      )}
    </>
  );
};

export default FuelAnalysis;
