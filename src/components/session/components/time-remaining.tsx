import { DataDisplay } from "@/components/core/ui/data-display";
import { formatTime } from "@/components/utils/formatter/UnitConversion";
import {
  selectCurrentSession,
  selectCurrentSessionTiming,
  useSelector,
} from "@/lib/redux";
import { TrackSession } from "@/lib/redux/slices/sessionSlice/models";

export const TimeRemaining = () => {
  const timing = useSelector(selectCurrentSessionTiming);
  const session: TrackSession | undefined = useSelector(selectCurrentSession);

  const showComponent = () => {
    return session?.isTimed || session?.isQualify;
  };

  const getTime = () => {
    let res = " - / -";
    if (session?.sessionState === "Racing") {
      res =
        formatTime(timing?.raceTimeRemaining?.toFixed(3)) +
        " / " +
        formatTime(session?.raceTime);
    } else if (session?.sessionState === "GetInCar" && !session?.isQualify) {
      res = formatTime(timing?.raceTimeRemaining?.toFixed(3));
    } else if (session?.sessionState === "ParadeLaps") {
      res =
        formatTime(session?.raceTime) + " / " + formatTime(session?.raceTime);
    }

    return res;
  };

  return (
    <>
      {showComponent() && (
        <DataDisplay title="Time Remaining" content={getTime()} />
      )}
    </>
  );
};
