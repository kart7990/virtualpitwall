import { SelectItem } from "@/components/core/ui/select";
import { selectCompletedLaps, useDispatch, useSelector } from "@/lib/redux";
import { ReactElement, useEffect, useState } from "react";
import LapTimes from "./components/lap-times";

const LapComparison = () => {
  const dispatch = useDispatch();
  const [selectedDriver, setSelectedDriver] = useState<string>();
  const selectedLaps = useSelector(selectCompletedLaps);
  const [selectableDrivers, setSelectableDrivers] = useState<
    ReactElement<any, any>[]
  >([]);
  const [data, setData] = useState<string[][]>([]);

  const header = ["Lap Number", "Stint Number", "Laptime"];

  useEffect(() => {
    const getSelectableDrivers = () => {
      const uniqueDrivers: string[] = [];
      if (selectedLaps && selectedLaps.laps) {
        return selectedLaps.laps
          .filter((lap) => {
            const carNumber: string = lap.getCarNumber();
            if (!uniqueDrivers.includes(carNumber)) {
              uniqueDrivers.push(carNumber);
              return true;
            }
            return false;
          })
          .map((lap) => {
            return (
              <SelectItem key={lap.getCarNumber()} value={lap.getCarNumber()}>
                <div className="grid gap-2">
                  <div className="flex items-center">{lap.getDriverName()}</div>
                </div>
              </SelectItem>
            );
          });
      }

      return [];
    };

    setSelectableDrivers(getSelectableDrivers());
  }, [selectedLaps]);

  useEffect(() => {
    const getData = () => {
      return selectedLaps && selectedLaps.laps
        ? selectedLaps.laps
            .filter((lap) => {
              return lap.getCarNumber() === selectedDriver;
            })
            .map((lap) => {
              return [
                "" + lap.getLapNumber(),
                "" + lap.getStint(),
                lap.getLapTime(),
              ];
            })
        : [];
    };

    setData(getData());
  }, [selectedDriver, selectedLaps]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2">
        <LapTimes />
        <LapTimes />
      </div>
    </>
  );
};

export default LapComparison;
