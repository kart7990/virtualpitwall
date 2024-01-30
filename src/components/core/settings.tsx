"use client";

import { Icons } from "./icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "@/components/core/ui/button";
import { Input } from "@/components/core/ui/input";
import { Label } from "@/components/core/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/core/ui/sheet";
import {
  useDispatch,
  preferencesSlice,
  MeasurementSystem,
  selectMeasurementSystem,
  useSelector,
} from "@/lib/redux";

export function Settings() {
  const dispatch = useDispatch();
  const selectedMeasurementSystem = useSelector(selectMeasurementSystem);

  console.log(selectedMeasurementSystem.toString());
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
              var system = MeasurementSystem[parseInt(e)];
              if (system === MeasurementSystem.Imperial.toString()) {
                dispatch(
                  preferencesSlice.actions.updateMeasurementSystem(
                    MeasurementSystem.Imperial,
                  ),
                );
              } else {
                dispatch(
                  preferencesSlice.actions.updateMeasurementSystem(
                    MeasurementSystem.Metric,
                  ),
                );
              }
            }}
            defaultValue={selectedMeasurementSystem.toString()}
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
