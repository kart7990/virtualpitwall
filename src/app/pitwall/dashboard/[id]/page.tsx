"use client";

import PitwallConnection from "@/components/connection/pitwall-connection";
import PitwallSessionMock from "@/components/connection/pitwall-session-mock";
import { MOCKING } from "@/config/site";
import Dashboard from "./components/dashboard";
import "./style.css";

export default function Page({ params }: { params: { id: string } }) {
  const pitboxSessionId = params.id;

  const pitwallSession = () => {
    if (MOCKING) {
      return (
        <PitwallSessionMock>
          <Dashboard />
        </PitwallSessionMock>
      );
    } else {
      return (
        <PitwallConnection pitwallSessionId={pitboxSessionId}>
          <Dashboard />
        </PitwallConnection>
      );
    }
  };

  return pitwallSession();
}
