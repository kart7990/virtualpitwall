import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { Conditions } from "../conditions/conditions";
import { DataDisplay } from "../core/ui/data-display";
import Popover from "../core/ui/popover";
import { LapsRemaining } from "./components/laps-remaining";
import { TimeRemaining } from "./components/time-remaining";

export const Session = () => {
  const session = useSelector(selectCurrentTrackSession);

  return (
    <>
      {!session && <p>waiting for data</p>}
      {session && (
        <>
          <Popover title="Conditions" content={<Conditions />} />
          <DataDisplay title="Session Type" content={session.type} />
          <TimeRemaining />
          <DataDisplay title="Status" content={session.state} />
          <LapsRemaining />
          <DataDisplay title="Flags" content={session.flags} />
        </>
      )}
    </>
  );
};
