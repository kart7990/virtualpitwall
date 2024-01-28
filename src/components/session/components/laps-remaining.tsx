import { DataDisplay } from "@/components/core/ui/data-display";
import {
  selectCurrentTrackSession,
  getLiveTiming,
  useSelector,
} from "@/lib/redux";
import { TrackSession } from "@/lib/redux/slices/pitwallSlice/models";

export const LapsRemaining = () => {
  const timing = useSelector(getLiveTiming);
  const session: TrackSession | undefined = useSelector(
    selectCurrentTrackSession,
  );

  const showComponent = () => {
    return session?.name === "RACE";
  };

  const getSelectedCar = () => {
    return timing.find((car) => car.position === 1);
  };

  const getCurrentLap = () => {
    const car = getSelectedCar();
    return car !== undefined ? car.lap : "-";
  };

  const getRemainingLaps = () => {
    let res = "-";
    if (timing) {
      if (session?.isTimed && session?.state !== "ParadeLaps") {
        res = "~" + session?.estimatedRaceLaps.toFixed(2);
      } else if (session?.isFixedLaps) {
        res = session.raceLaps.toString();
      }
    }
    return res;
  };

  return (
    <>
      {showComponent() && (
        <DataDisplay
          title="Race Lap"
          content={getCurrentLap() + " / " + getRemainingLaps()}
        />
      )}
    </>
  );
};
