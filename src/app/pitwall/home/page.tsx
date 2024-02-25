"use client";

import { Button } from "@/components/core/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/core/ui/card";
import { siteConfig } from "@/config/site";
import { API_V1_URL } from "@/config/urls";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const authenticatedPing = async () => {
    console.log(await axios.get(`${API_V1_URL}/ping`));
  };

  return (
    <main className="m-3">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="col-span-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Step 1 - Install Virtual Pitwall
            </CardTitle>
            <CardDescription>
              Virtual Pitwall requires an application to be installed which
              sends iRacing session and telemetry data to the Virtual Pitwall
              dashboard. If you are only viewing the dashboard for an existing
              session, the install is not necessary. Simply use the link
              provided by the users of the session you wish to view.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={siteConfig.links.client}
              target="_blank"
              rel="noreferrer"
            >
              <Button>
                <span>Download App</span>
              </Button>
            </Link>
            <div
              id="alert-additional-content-4"
              className="mt-5 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <div className="text-sm">
                When installing the app, a security warning might be displayed
                (depending on security settings) because the app isn't signed
                with a valid code signing certificate. That should be resolved
                soon, select "Run Anyway" for now.
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Step 2 - Start Session and Share Link
            </CardTitle>
            <CardDescription>
              Start a Virtual Pitwall session from the app, share the link, and
              load into an iRacing session. That's it! Realtime data will be
              sent to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              1. Create a new Pitwall session using the Windows app. Share the
              session URL created by the app with spotters and drivers who will
              be active for the session.
            </p>
            <p className="mt-3">
              2. The driver uses the Windows app to connect to the session with
              the session URL. Multiple drivers are able to connect to the same
              Pitwall session, which can be useful for team events. In the
              Windows app, the driver should select the option for providing
              telemetry data. Optionally, the driver may choose to provide
              session data if a spotter or spectator is not able to spectate the
              iRacing session and connect with the Windows app. The ideal combo
              is for a driver to only provide telemetry, and a spotter or
              spectator to provide session data. This allows the Windows app to
              reduce CPU and network utilization and allows the driver to keep
              performance settings in iRacing, such as max cars visible, to
              existing settings to maximize frame rates. For session data
              providers, if the max cars visible setting in iRacing is less than
              the number of cars on track, the Pitwall dashboard may be
              inaccurate.
            </p>
            <p className="mt-3">
              3. Spectators or spotters use the Windows app to connect to the
              session with the session URL to provide session data. Multiple
              spotters are able to connect to the same Pitwall session to
              provide session data. It is important that spotters have the
              maximum number of cars visible in iRacing settings or the data may
              be inaccurate.
            </p>
            <p className="mt-3">
              4. Race engineers view the dashboard by navigating to the session
              URL in any modern web browser. The session data provider and
              telemetry provider can be selected in the dashboard if multiple
              are connected to the same session.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
