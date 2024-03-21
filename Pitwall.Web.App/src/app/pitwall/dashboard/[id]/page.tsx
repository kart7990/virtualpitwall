"use client";

import PitwallConnection from "@/components/connection/pitwall-connection";
import PitwallSessionMock from "@/components/connection/pitwall-session-mock";
import { MOCKING } from "@/config/site";
import { default as PitwallDashboard } from "./dashboards/pitwall-dashboard";
import "./style.css";

export default function Page({ params }: { params: { id: string } }) {
  const pitboxSessionId = params.id;

  const pitwallSession = () => {
    if (MOCKING) {
      return (
        <PitwallSessionMock>
          <PitwallDashboard />
        </PitwallSessionMock>
      );
    } else {
      return (
        <PitwallConnection pitwallSessionId={pitboxSessionId}>
          <PitwallDashboard />
        </PitwallConnection>
      );
    }
  };

  return pitwallSession();
}
