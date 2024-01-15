import {
  getCarClassName,
  parseIRating,
} from "../utils/formatter/CarConversion";
import { convertMsToDisplay } from "../utils/formatter/UnitConversion";
import {
  selectCurrentSession,
  useSelector,
  selectLiveTiming,
  LiveTiming,
} from "@/lib/redux";

interface CarDetails {
  name: string;
  color: string;
  count: number;
  fastestLap: number;
  fastestLapDriver: string;
}

interface SplitDetails {
  iRatingTotal: number;
  count: number;
}

export const SingleClassDetails = () => {
  const session = useSelector(selectCurrentSession);
  const standings = useSelector<LiveTiming[]>(selectLiveTiming);

  const totalIRating = standings.reduce(
    (sum, current) => sum + current.iRating,
    0,
  );

  const carClass = () => {
    const res = standings.reduce(
      (res, car) => {
        if (!res[car.carName]) {
          res[car.carName] = {
            count: 1,
            name: car.carName,
            color: car.classColor,
            fastestLap: car.bestLaptime,
            fastestLapDriver: car.driverName,
          };
        } else {
          let c = res[car.carName];
          c.count += 1;

          if (car.bestLaptime > 0 && c.fastestLap > car.bestLaptime) {
            c.fastestLap = car.bestLaptime;
            c.fastestLapDriver = car.driverName;
          }
        }
        return res;
      },
      {} as Record<string, CarDetails>,
    );

    return res;
  };

  const carClassValues = Object.values(carClass());
  const fastestCar =
    carClassValues.length === 0
      ? null
      : carClassValues.reduce((fastest, current) => {
          return current.fastestLap < fastest.fastestLap ? current : fastest;
        });

  const getFastestLapComponent = (car: CarDetails | null) => {
    let res = "Fastest Lap: ";
    if (car === null || car.fastestLap <= 0) {
      res += "n/a";
    } else {
      res +=
        convertMsToDisplay(car.fastestLap) + " (" + car.fastestLapDriver + ")";
    }

    return res;
  };

  return (
    <>
      {!session && <p>waiting for data</p>}
      {session && (
        <div className="overflow-auto h-full pb-10">
          <div className="flex flex-col gap-4 p-3">
            <div>
              <div className="font-medium">
                SoF: {parseIRating(totalIRating, standings.length)}
              </div>
              <div className="font-medium">
                {getFastestLapComponent(fastestCar)}
              </div>
            </div>
            {Object.entries(carClass()).map(([carName, car]) => {
              return (
                <div key={carName}>
                  <div>
                    <span className="flex items-center uppercase text-slate-500">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: car.color,
                        }}
                      ></div>
                      {car.name}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <div className="font-medium">Car Count: {car.count}</div>
                      <div className="font-medium">
                        {getFastestLapComponent(car)}
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
