import {
  getCarClassName,
  parseCarClassColor,
  parseIRating,
} from "../utils/formatter/CarConversion";
import { convertMsToDisplay } from "../utils/formatter/UnitConversion";
import {
  selectCurrentSession,
  useSelector,
  selectLiveTiming,
  LiveTiming,
} from "@/lib/redux";
import { Faster_One } from "next/font/google";

interface CarClassDetails {
  id: number;
  name: string;
  color: string;
  count: number;
  iRatingTotal: number;
  fastestLap: number;
  fastestLapDriver: string;
}

export const CarClasses = () => {
  const session = useSelector(selectCurrentSession);
  const standings = useSelector<LiveTiming[]>(selectLiveTiming);

  const carClasses = () => {
    const res = standings.reduce(
      (res, car) => {
        if (!res[car.classId]) {
          res[car.classId] = {
            count: 1,
            id: car.classId,
            name: car.className,
            color: car.classColor,
            iRatingTotal: car.iRating,
            fastestLap: car.bestLaptime,
            fastestLapDriver: car.driverName,
          };
        } else {
          let c = res[car.classId];
          c.count += 1;
          c.iRatingTotal += car.iRating;

          if (car.bestLaptime > 0 && c.fastestLap > car.bestLaptime) {
            c.fastestLap = car.bestLaptime;
            c.fastestLapDriver = car.driverName;
          }
        }
        return res;
      },
      {} as Record<number, CarClassDetails>,
    );

    return res;
  };

  return (
    <>
      {!session && <p>waiting for data</p>}
      {session && (
        <div className="overflow-auto h-full pb-10">
          <div className="flex flex-wrap gap-4 p-3">
            {Object.entries(carClasses()).map(([classId, carClass]) => {
              return (
                <div key={classId}>
                  <div>
                    <span className="flex items-center uppercase text-slate-500">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: carClass.color,
                        }}
                      ></div>
                      {getCarClassName(carClass.id, carClass.name)}
                    </span>
                  </div>
                  <div>
                    <div>
                      <div className="font-medium">
                        Car Count: {carClass.count}
                      </div>
                      <div className="font-medium">
                        SoF:{" "}
                        {parseIRating(carClass.iRatingTotal, carClass.count)}
                      </div>
                      <div className="font-medium">
                        Fastest Lap: {convertMsToDisplay(carClass.fastestLap)} (
                        {carClass.fastestLapDriver})
                      </div>
                    </div>
                  </div>
                  <div className="relative"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
