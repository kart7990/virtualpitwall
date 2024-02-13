import {
  getLiveTiming,
  selectCurrentTrackSession,
  useSelector,
} from "@/lib/redux";
import { LiveTiming } from "@/lib/redux/slices/pitwallSlice/models";
import { useEffect } from "react";
import { parseIRating } from "../utils/formatter/CarConversion";
import { convertMsToDisplay } from "../utils/formatter/Time";

interface CarDetails {
  name: string;
  color: string;
  count: number;
  fastestLap: number;
  fastestLapDriver: string;
}

export const SingleClassDetails = ({
  setCarClassTitle,
}: {
  setCarClassTitle: (title: string) => void;
}) => {
  const session = useSelector(selectCurrentTrackSession);
  const standings = useSelector<LiveTiming[]>(getLiveTiming);

  const totalIRating = standings.reduce(
    (sum, current) => sum + current.iRating,
    0,
  );

  useEffect(() => {
    setCarClassTitle("Single-Class Details");
  });

  const carClass = () => {
    const res = standings.reduce(
      (res, car) => {
        if (!res[car.carName]) {
          res[car.carName] = {
            count: 1,
            name: car.carName,
            color: car.classColor,
            fastestLap:
              car.bestLaptime === -1000 ? Number.MAX_VALUE : car.bestLaptime,
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

  const carClassValues: CarDetails[] = Object.values(carClass());
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

  const getSoF = () => {
    let res = <></>;

    if (session?.type !== "Offline Testing") {
      res = (
        <div className="font-medium">
          SoF: {parseIRating(totalIRating, standings.length)}
        </div>
      );
    }

    return res;
  };

  return (
    <>
      {!session && <p>waiting for data</p>}
      {
        /* Single Car Class with multiple cars */
        session && carClassValues.length > 1 && (
          <div className="overflow-auto h-full pb-10">
            <div className="flex flex-col gap-4 p-2">
              <div>
                {getSoF()}
                <div className="font-medium">
                  {getFastestLapComponent(fastestCar)}
                </div>
              </div>
              {Object.entries(carClass()).map(([carName, car]) => {
                return (
                  <div key={carName}>
                    <div>
                      <span className="flex items-center uppercase text-slate-500">
                        {car.name}
                        <div className="justify-center items-center ml-2 mr-1">
                          🏎️
                        </div>
                        {car.count}
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-col">
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
        )
      }
      {
        /* Single Car Class with just one car */
        session && carClassValues.length === 1 && (
          <div className="overflow-auto h-full pb-10">
            <div className="flex flex-col p-2">
              <span className="flex items-center uppercase text-slate-500">
                {carClassValues[0].name}
                <div className="justify-center items-center ml-2 mr-1">🏎️</div>
                {carClassValues[0].count}
              </span>
              {getSoF()}
              <div className="font-medium">
                {getFastestLapComponent(fastestCar)}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};
