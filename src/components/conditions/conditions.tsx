import { DataDisplay } from "../core/ui/data-display"
import { convertWeatherType, formatTemp, formatSpeed } from "../utils/formatter/UnitConversion"
import { selectCurrentSessionConditions, useSelector } from '@/lib/redux';

export const Conditions = () => {
    const conditions = useSelector(selectCurrentSessionConditions)
    const useImperialUnits = false

    return (
        <>
            {!conditions &&
                <p>waiting for data</p>
            }
            {conditions &&
                <div className="flex p-3 flex-wrap gap-4">
                    <DataDisplay title="Track Temp" content={formatTemp(conditions.trackTemp.toString(), useImperialUnits)} />
                    <DataDisplay title="Air Temp" content={formatTemp(conditions?.airTemp, useImperialUnits)} />
                    <DataDisplay title="Wind" content={conditions?.windDirection + " " + formatSpeed(conditions?.windSpeed, useImperialUnits)} />
                    <DataDisplay title="Weather Type" content={convertWeatherType(conditions.weatherType)} />
                    <DataDisplay title="Skies" content={conditions.skies.toString()} />
                    <DataDisplay title="Relative Humidity" content={(conditions?.relativeHumidity * 100).toFixed(0) + "%"} />
                </div>
            }
        </>
    )
}
