"use client";

import Dashboard from "./components/dashboard";
import "./style.css";
import PitwallSession from "@/components/connection/pitwall-session";
import PitwallSessionMock from "@/components/connection/pitwall-session-mock";
import PitwallConnection from "@/components/connection/v2/pitwall-connection";
import { MOCKING } from "@/config/site";

export default function Page({ params }: { params: { id: string } }) {
  const pitboxSessionId = params.id;
  const isV2 = true;

  const pitwallSession = () => {
    console.log("DAVIDH", "v2");
    if (MOCKING) {
      return (
        <PitwallSessionMock pitwallSessionId={pitboxSessionId}>
          <Dashboard />
        </PitwallSessionMock>
      );
    } else if (isV2) {
      return (
        <PitwallConnection pitwallSessionId={pitboxSessionId}>
          <div> Hi </div>
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
