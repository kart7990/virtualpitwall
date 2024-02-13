"use client";

import { Button } from "@/components/core/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/core/ui/sheet";
import {
  preferencesSlice,
  selectMeasurementSystem,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { MeasurementSystem } from "@/lib/redux/slices/preferencesSlice/models";
import { Icons } from "./icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Settings() {
  const dispatch = useDispatch();
  const selectedMeasurementSystem = useSelector(selectMeasurementSystem);

  console.log(selectedMeasurementSystem.measurement.toString());
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-9 px-0" variant={"ghost"}>
          <Icons.cogWheel className="h-8 w-8" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Set your dashboard preferences</SheetDescription>
        </SheetHeader>
        <div className="grid mt-6">
          <span className="uppercase text-slate-500">Unit System:</span>
          <Select
            onValueChange={(e) => {
              dispatch(
                preferencesSlice.actions.updateMeasurementSystem(parseInt(e)),
              );
            }}
            defaultValue={selectedMeasurementSystem.measurement.toString()}
          >
            <SelectTrigger id="telemetry-provider">
              <SelectValue placeholder="---Select Driver---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                key={MeasurementSystem.Metric.toString()}
                value={MeasurementSystem.Metric.toString()}
              >
                <div className="grid gap-2">
                  <div className="flex items-center">
                    Metric (km/h, kg, etc.)
                  </div>
                </div>
              </SelectItem>
              <SelectItem
                key={MeasurementSystem.Imperial.toString()}
                value={MeasurementSystem.Imperial.toString()}
              >
                <div className="grid gap-2">
                  <div className="flex items-center">
                    Imperial (mph, lb, etc.)
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SheetContent>
    </Sheet>
  );
}
