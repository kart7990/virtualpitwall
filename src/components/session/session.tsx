import { DataDisplay } from "../core/ui/data-display";
import { LapsRemaining } from "./components/laps-remaining";
import { TimeRemaining } from "./components/time-remaining";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useEffect } from "react";

export const Session = ({
  setSessionTitle,
}: {
  setSessionTitle: (title: string) => void;
}) => {
  const session = useSelector(selectCurrentTrackSession);

  return (
    <>
      {!session && <p>waiting for data</p>}
      {session && (
        <>
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
