"use client";

import Dashboard from "./components/dashboard";
import "./style.css";
import PitwallSession from "@/components/connection/pitwall-session";
import PitwallSessionMock from "@/components/connection/pitwall-session-mock";
import { MOCKING } from "@/config/site";

export default function Page({ params }: { params: { id: string } }) {
  const pitboxSessionId = params.id;

  const pitwallSession = () => {
    if (MOCKING) {
      return (
        <PitwallSessionMock pitwallSessionId={pitboxSessionId}>
          <Dashboard />
        </PitwallSessionMock>
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
