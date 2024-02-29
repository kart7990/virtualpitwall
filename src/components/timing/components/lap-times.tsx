import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/ui/select";
import SimpleTable from "@/components/core/ui/table";
import { selectCompletedLaps, useDispatch, useSelector } from "@/lib/redux";
import { ReactElement, useEffect, useState } from "react";

const LapTimes = () => {
  const dispatch = useDispatch();
  const [selectedDriver, setSelectedDriver] = useState<string>("-1");
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
            .sort((a, b) => Number(b[0]) - Number(a[0]))
        : [];
    };

    setData(getData());
  }, [selectedDriver, selectedLaps]);

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <div>
          <Select
            onValueChange={(e) => {
              setSelectedDriver(e);
            }}
            defaultValue="-1"
          >
            <SelectTrigger id="select-driver">
              <SelectValue placeholder="-1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="-1" value="--- Select Driver ---">
                <div className="gap-2">
                  <div className="flex items-center">--- Select Driver ---</div>
                </div>
              </SelectItem>
              {selectableDrivers}
            </SelectContent>
          </Select>
        </div>
        {selectedDriver && selectedDriver !== "-1" && (
          <div className="gap-2 p-2">
            <SimpleTable headers={header} data={data} />
          </div>
        )}
      </div>
    </>
  );
};

export default LapTimes;
