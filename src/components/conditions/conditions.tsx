import {
  selectCurrentConditions,
  selectCurrentTrackSession,
  selectMeasurementSystem,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";
import { formatSpeed } from "../utils/formatter/Speed";
import { convertWeatherType, formatTemp } from "../utils/formatter/Temps";
import { formatDateTime } from "../utils/formatter/Time";

export const Conditions = () => {
  const conditions = useSelector(selectCurrentConditions);
  const trackSession = useSelector(selectCurrentTrackSession);
  const measurement = useSelector(selectMeasurementSystem);

  return (
    <>
      {conditions && trackSession ? (
        <div className="grid grid-cols-3 gap-2 p-2">
          <DataDisplay
            title="Sim Time"
            content={formatDateTime(trackSession.gameDateTime)}
          />
          <DataDisplay
            title="Track Temp"
            content={formatTemp(conditions.trackTemp, measurement)}
          />
          <DataDisplay
            title="Air Temp"
            content={formatTemp(conditions.airTemp, measurement)}
          />
          <DataDisplay
            title="Weather Type"
            content={convertWeatherType(conditions.weatherType)}
          />
          <DataDisplay title="Skies" content={conditions.skies.toString()} />
          <DataDisplay
            title="Wind"
            content={
              conditions?.windDirection +
              " " +
              formatSpeed(conditions.windSpeed, measurement)
            }
          />
          <DataDisplay
            title="Relative Humidity"
            content={(conditions.relativeHumidity * 100).toFixed(0) + "%"}
          />
        </div>
      ) : (
        <p>waiting for data</p>
      )}
    </>
  );
};
