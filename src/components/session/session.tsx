import { DataDisplay } from "../core/ui/data-display";
import { LapsRemaining } from "./components/laps-remaining";
import { TimeRemaining } from "./components/time-remaining";
import { selectCurrentSession, useSelector } from "@/lib/redux";
import { useEffect } from "react";

export const Session = ({
  setSessionTitle,
}: {
  setSessionTitle: (title: string) => void;
}) => {
  const session = useSelector(selectCurrentSession);

  useEffect(() => {
    setSessionTitle(session ? session.sessionType + " Session Details" : "n/a");
  }, [session, setSessionTitle]);

  return (
    <>
      {!session && <p>waiting for data</p>}
      {session && (
        <div className="flex flex-wrap gap-4 p-3">
          <TimeRemaining />
          <DataDisplay title="Status" content={session.sessionState} />
          <LapsRemaining />

          <DataDisplay title="Flags" content={session.flags} />
        </div>
      )}
    </>
  );
};
