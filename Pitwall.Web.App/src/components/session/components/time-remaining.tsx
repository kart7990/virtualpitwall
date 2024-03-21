import { DataDisplay } from "@/components/core/ui/data-display";
import { formatTime } from "@/components/utils/formatter/Time";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { TrackSession } from "@/lib/redux/slices/pitwallSlice/models";

export const TimeRemaining = () => {
  const session: TrackSession | undefined = useSelector(
    selectCurrentTrackSession,
  );

  const showComponent = () => {
    return session?.isTimed || session?.name === "QUALIFY";
  };

  const getTime = () => {
    let res = " - / -";
    if (session?.state === "Racing") {
      res =
        formatTime(session?.raceTimeRemaining) +
        " / " +
        formatTime(session?.raceTime);
    } else if (session?.state === "GetInCar" && session?.name !== "QUALIFY") {
      res = formatTime(session?.raceTimeRemaining);
    } else if (session?.state === "ParadeLaps") {
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
