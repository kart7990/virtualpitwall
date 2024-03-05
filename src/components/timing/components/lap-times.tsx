import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/ui/select";
import SimpleTable from "@/components/core/ui/table";
import { selectCompletedLapsBySessionNumber, useSelector } from "@/lib/redux";
import { useState } from "react";

const LapTimes = ({ sessionNumber }: { sessionNumber: number }) => {
  const [selectedDriver, setSelectedDriver] = useState<string>("-1");
  const selectedLaps = useSelector(
    selectCompletedLapsBySessionNumber(sessionNumber),
  );

  const header = ["Lap Number", "Stint Number", "Laptime"];

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
        .sort((a, b) => Number(a.getCarNumber()) - Number(b.getCarNumber()))
        .map((lap) => {
          return (
            <SelectItem key={lap.getCarNumber()} value={lap.getCarNumber()}>
              <div className="grid gap-2">
                <div className="flex items-center">
                  {lap.getCarNumber()} - {lap.getDriverName()}
                </div>
              </div>
            </SelectItem>
          );
        });
    }

    return [];
  };

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
          .sort((a, b) => Number(b[0]) - Number(a[0]))
      : [];
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <div>
          <Select
            onValueChange={(e) => {
              setSelectedDriver(e);
            }}
          >
            <SelectTrigger id="data-provider">
              <SelectValue placeholder="--- Select Driver ---" />
            </SelectTrigger>
            <SelectContent>{getSelectableDrivers()}</SelectContent>
          </Select>
        </div>
        {selectedDriver && selectedDriver !== "-1" && (
          <div className="gap-2 p-2">
            <SimpleTable headers={header} data={getData()} />
          </div>
        )}
      </div>
    </>
  );
};

export default LapTimes;
