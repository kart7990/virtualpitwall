"use client";

import Dashboard from "./components/dashboard";
import "./style.css";
import { Conditions } from "@/components/conditions/conditions";
import PitwallSession from "@/components/connection/pitwall-session";
import PitwallSessionMock from "@/components/connection/pitwall-session-mock";
import PitwallConnection from "@/components/connection/v2/pitwall-connection";
import { TrackMap } from "@/components/trackmap/trackmap";
import { MOCKING } from "@/config/site";

export default function Page({ params }: { params: { id: string } }) {
  const pitboxSessionId = params.id;
  const isV2 = true;

  const pitwallSession = () => {
    if (MOCKING) {
      return (
        <PitwallSessionMock pitwallSessionId={pitboxSessionId}>
          <Dashboard />
        </PitwallSessionMock>
      );
    } else if (isV2) {
      return (
        <PitwallConnection pitwallSessionId={pitboxSessionId}>
          <Conditions />
          <TrackMap />
        </PitwallConnection>
      );
    } else {
      return (
        <PitwallSession pitwallSessionId={pitboxSessionId}>
          <Dashboard />
        </PitwallSession>
      );
    }
  };

  return pitwallSession();
}
