import { DataDisplay } from "../core/ui/data-display"
import { selectCurrentSessionConditions, useSelector } from '@/lib/redux';

export const Conditions = () => {
    const conditions = useSelector(selectCurrentSessionConditions)

    return (
        <>
            {!conditions &&
                <p>waiting for data</p>
            }
            {conditions &&
                <div className="flex p-3 flex-wrap gap-4">
                    <DataDisplay title="track temp" content={conditions.trackTemp.toString()} />
                    <DataDisplay title="wind" content={conditions.windSpeed.toString()} />
                    <DataDisplay title="air temp" content={conditions.airTemp.toString()} />
                    <DataDisplay title="humidity" content={conditions.relativeHumidity.toString()} />
                    <DataDisplay title="pressure" content={conditions.airPressure.toString()} />
                    <DataDisplay title="density" content={conditions.airDensity.toString()} />
                </div>
            }
        </>
    )
}
