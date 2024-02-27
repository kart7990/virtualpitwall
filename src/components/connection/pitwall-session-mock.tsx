"use client";

import { pitwallSlice, useDispatch } from "@/lib/redux";
import { useEffect, useState } from "react";
import addTelemetryLaps from "./../../../mock-data/multi-class-timed-new/add-telemetry-laps-1.json";
import pitboxSessionInit from "./../../../mock-data/multi-class-timed-new/pitwall-session-init.json";
import setDynamicTrackSessionData from "./../../../mock-data/multi-class-timed-new/set-dynamic-track-session-data.json";
import gameSessionData from "./../../../mock-data/multi-class-timed-new/set-game-session.json";
import setLiveTiming from "./../../../mock-data/multi-class-timed-new/set-live-timing.json";
import setTelemetry from "./../../../mock-data/multi-class-timed-new/set-telemetry.json";

export default function PitwallConnection({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  //Page State
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const sessionData = JSON.parse(JSON.stringify(pitboxSessionInit));
    dispatch(pitwallSlice.actions.init(sessionData));

    // dispatch(pitwallSlice.actions.addGameDataProvider(gameDataProvider));
    // dispatch(pitwallSlice.actions.addTelemetryProvider(telemetryProvider));
    const gameSession = JSON.parse(JSON.stringify(gameSessionData));
    dispatch(pitwallSlice.actions.setGameSession(gameSession));
    // dispatch(pitwallSlice.actions.newGameSession(gameSession));
    // dispatch(pitwallSlice.actions.changeTrackSession(trackSession));

    const dynamicTrackSession = JSON.parse(
      JSON.stringify(setDynamicTrackSessionData),
    );
    dispatch(
      pitwallSlice.actions.setDynamicTrackSessionData(dynamicTrackSession),
    );

    const liveTiming = JSON.parse(JSON.stringify(setLiveTiming));
    dispatch(pitwallSlice.actions.setStandings(liveTiming));
    // dispatch(pitwallSlice.actions.addLaps(completedLaps));

    const telemetry = JSON.parse(JSON.stringify(setTelemetry));
    dispatch(pitwallSlice.actions.setTelemetry(telemetry));

    const telemetryLaps = JSON.parse(JSON.stringify(addTelemetryLaps));
    dispatch(pitwallSlice.actions.addTelemetryLaps(telemetryLaps));

    setLoading(false);
  }, [dispatch]);

  function LoadingWrapper({ children }: { children: React.ReactNode }) {
    if (isLoading) {
      return <div> loading... </div>;
    } else {
      return children;
    }
  }

  return <>{LoadingWrapper({ children })}</>;
}
