import {
  selectCurrentConditions,
  selectCurrentTrackSession,
  useSelector,
} from "@/lib/redux";
import { DataDisplay } from "../core/ui/data-display";
import {
  convertWeatherType,
  formatSpeed,
  formatTemp,
  formatTime,
} from "../utils/formatter/UnitConversion";

export const Conditions = () => {
  const conditions = useSelector(selectCurrentConditions);
  const trackSession = useSelector(selectCurrentTrackSession);
  const useImperialUnits = false;

  return (
    <>
      {!conditions && <p>waiting for data</p>}
      {conditions && (
        <div className="flex flex-wrap gap-4 p-2">
          <DataDisplay
            title="Sim Time"
            content={formatTime(trackSession?.gameDateTime)}
          />
          <DataDisplay
            title="Track Temp"
            content={formatTemp(
              conditions.trackTemp.toString(),
              useImperialUnits,
            )}
          />
          <DataDisplay
            title="Air Temp"
            content={formatTemp(conditions?.airTemp, useImperialUnits)}
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
              formatSpeed(conditions?.windSpeed, useImperialUnits)
            }
          />
          <DataDisplay
            title="Relative Humidity"
            content={(conditions?.relativeHumidity * 100).toFixed(0) + "%"}
          />
        </div>
      )}
    </>
  );
};
