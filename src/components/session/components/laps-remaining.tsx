import { DataDisplay } from "@/components/core/ui/data-display";
import {
  selectCurrentSession,
  selectCurrentSessionTiming,
  selectLiveTiming,
  useSelector,
} from "@/lib/redux";
import { TrackSession } from "@/lib/redux/slices/sessionSlice/models";

export const LapsRemaining = () => {
  const timing = useSelector(selectCurrentSessionTiming);
  const session: TrackSession | undefined = useSelector(selectCurrentSession);
  const standings = useSelector(selectLiveTiming);

  const showComponent = () => {
    return session?.isRace;
  };

  const getSelectedCar = () => {
    return standings.find((car) => car.position === 1);
  };

  const getCurrentLap = () => {
    const car = getSelectedCar();
    return car !== undefined ? car.lap : "-";
  };

  const getRemainingLaps = () => {
    let res = "-";
    if (timing) {
      if (session?.isTimed && session?.sessionState !== "ParadeLaps") {
        res = "~" + timing?.estimatedRaceLaps.toFixed(2);
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
